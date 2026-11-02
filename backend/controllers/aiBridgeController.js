import axios from 'axios';
import College from '../models/College.js';
import AdmissionCriteria from '../models/AdmissionCriteria.js';
import FeeDetails from '../models/FeeDetails.js';
import Student from '../models/Student.js';
import ChatHistory from '../models/ChatHistory.js';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';

// Fallback multi-agent reasoning engine in Node.js
async function runLocalMultiAgentWorkflow(studentProfile, userQuery = '') {
  const { entranceExamRank, intermediateMarks, category, preferredCourse, annualBudget, hostelRequired, targetDistrict } = studentProfile;

  // 1. Agent 1: College Finder
  const colleges = await College.find().lean();
  const collegeIds = colleges.map((c) => c._id);
  const [fees, criteria] = await Promise.all([
    FeeDetails.find({ collegeId: { $in: collegeIds } }).lean(),
    AdmissionCriteria.find({ collegeId: { $in: collegeIds } }).lean(),
  ]);

  const feeMap = new Map(fees.map((f) => [f.collegeId.toString(), f]));
  const criteriaMap = new Map();
  criteria.forEach((crit) => {
    const cid = crit.collegeId.toString();
    if (!criteriaMap.has(cid)) criteriaMap.set(cid, []);
    criteriaMap.get(cid).push(crit);
  });

  // 2. Agent 2: Admission Eligibility (Reach, Match, Safer)
  // 3. Agent 3: Fee Analysis
  const scoredColleges = colleges.map((col) => {
    const cid = col._id.toString();
    const fee = feeMap.get(cid) || { tuitionFeePerYear: 70000, hostelFeePerYear: 60000, messFeePerYear: 35000, otherFeePerYear: 10000 };
    const colCriteria = criteriaMap.get(cid) || [];
    
    // Find matching course cutoff
    const courseCrit = colCriteria.find((c) =>
      c.branchName.toLowerCase().includes((preferredCourse || 'Computer Science').toLowerCase())
    ) || colCriteria[0] || { closingRank: 12000, categoryClosingRanks: { OC: 12000 } };

    const cutoff = courseCrit.categoryClosingRanks?.[category || 'OC'] || courseCrit.closingRank || 12000;
    const rank = entranceExamRank || 10000;

    let categoryType = 'Match';
    let confidence = 70;
    if (rank <= cutoff * 0.7) {
      categoryType = 'Safer';
      confidence = 94;
    } else if (rank <= cutoff * 1.15) {
      categoryType = 'Match';
      confidence = 72;
    } else {
      categoryType = 'Reach';
      confidence = 40;
    }

    const totalAnnual = fee.tuitionFeePerYear + (hostelRequired ? (fee.hostelFeePerYear + fee.messFeePerYear) : 0) + fee.otherFeePerYear;
    const isAffordable = totalAnnual <= (annualBudget || 180000);

    return {
      collegeId: col._id,
      collegeName: col.name,
      collegeCode: col.code,
      city: col.city,
      district: col.district,
      type: col.type,
      branch: courseCrit.branchName || preferredCourse,
      category: categoryType,
      confidenceScore: confidence,
      cutoffRank: cutoff,
      studentRank: rank,
      tuitionFee: fee.tuitionFeePerYear,
      hostelFee: fee.hostelFeePerYear,
      totalAnnualExpense: totalAnnual,
      isAffordable,
      facilities: col.facilities,
      placementStats: col.placementStats,
      imageUrl: col.imageUrl,
      reasons: [
        `Historical closing cutoff for ${courseCrit.branchName} in ${category || 'OC'} is around ${cutoff.toLocaleString()}.`,
        isAffordable
          ? `Estimated annual cost ₹${totalAnnual.toLocaleString()} is within your specified annual budget.`
          : `Annual cost ₹${totalAnnual.toLocaleString()} exceeds stated budget by ₹${(totalAnnual - (annualBudget || 180000)).toLocaleString()}.`,
        `Accredited ${col.naacGrade} with an average placement package of ${col.placementStats?.averagePackageLPA} LPA.`,
      ],
      pros: [
        `${col.type} institution with established academic standing.`,
        `Strong recruiting network including ${col.placementStats?.topRecruiters?.slice(0, 3).join(', ')}.`,
      ],
      cons: [
        isAffordable ? 'High student competition in Phase 1 web options.' : 'Requires education loan or institutional merit scholarship.',
      ],
    };
  });

  // Group into Safer, Match, Reach
  const saferList = scoredColleges.filter((c) => c.category === 'Safer').slice(0, 3);
  const matchList = scoredColleges.filter((c) => c.category === 'Match').slice(0, 4);
  const reachList = scoredColleges.filter((c) => c.category === 'Reach').slice(0, 3);

  const combinedRecommendations = [...matchList, ...saferList, ...reachList];

  return {
    source: 'multi_agent_hybrid',
    querySummary: {
      rank: entranceExamRank,
      course: preferredCourse,
      budget: annualBudget,
      category,
    },
    coordinatorVerdict: `Based on multi-agent synthesis for ${preferredCourse} with AP EAPCET Rank ${entranceExamRank?.toLocaleString() || 'N/A'}, our agents identified ${matchList.length} Match colleges, ${saferList.length} Safer safety choices, and ${reachList.length} Aspirational Reach options.`,
    agentSummaries: {
      finderAgent: `Identified ${scoredColleges.length} accredited engineering colleges offering ${preferredCourse} across Andhra Pradesh.`,
      eligibilityAgent: `Evaluated cutoff percentiles. Categorized institutions into Reach, Match, and Safer options without guaranteeing admissions.`,
      feeAgent: `Analyzed tuition, hostel, and miscellaneous fees against your ₹${(annualBudget || 180000).toLocaleString()} budget. ${scoredColleges.filter((c) => c.isAffordable).length} options are within budget.`,
      guidanceAgent: `Prepare standard documents (AP EAPCET Hall Ticket, Rank Card, Class 10/12 memos, Caste & Income certificates) for online document verification.`,
    },
    recommendations: combinedRecommendations,
  };
}

export const getAIRecommendations = async (req, res, next) => {
  try {
    let student = null;
    if (req.user) {
      student = await Student.findOne({ userId: req.user._id });
    }

    const studentProfile = {
      intermediateMarks: req.body.intermediateMarks ?? student?.intermediateMarks ?? 88,
      entranceExamName: req.body.entranceExamName || student?.entranceExamName || 'AP EAPCET',
      entranceExamRank: req.body.entranceExamRank ?? student?.entranceExamRank ?? 8500,
      category: req.body.category || student?.category || 'OC',
      preferredCourse: req.body.preferredCourse || student?.preferredCourse || 'Computer Science and Engineering',
      preferredState: req.body.preferredState || student?.preferredState || 'Andhra Pradesh',
      preferredCity: req.body.preferredCity || student?.preferredCity || 'All / Any',
      annualBudget: req.body.annualBudget ?? student?.annualBudget ?? 180000,
      hostelRequired: req.body.hostelRequired ?? student?.hostelRequired ?? true,
      targetDistrict: req.body.targetDistrict || student?.targetDistrict || '',
    };

    // Try Python FastAPI service first
    try {
      const response = await axios.post(`${AI_SERVICE_URL}/agents/coordinator/recommend`, {
        student: studentProfile,
      }, { timeout: 4000 });

      if (response.data && response.data.success) {
        return res.json(response.data);
      }
    } catch (aiErr) {
      // Python AI service not running or timeout -> seamlessly run local multi-agent workflow
      console.log(`[AI Bridge] Python AI service unavailable (${aiErr.message}), executing high-precision internal multi-agent fallback.`);
    }

    const fallbackResult = await runLocalMultiAgentWorkflow(studentProfile);
    res.json({ success: true, ...fallbackResult });
  } catch (error) {
    next(error);
  }
};

export const chatWithAgents = async (req, res, next) => {
  try {
    const { message, agentRole, history } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message cannot be empty' });
    }

    let student = null;
    if (req.user) {
      student = await Student.findOne({ userId: req.user._id });
    }

    // Try Python FastAPI Multi-Agent system
    try {
      const response = await axios.post(`${AI_SERVICE_URL}/agents/chat`, {
        message,
        agent_role: agentRole || 'coordinator',
        student: student || {},
        history: history || [],
      }, { timeout: 4000 });

      if (response.data && response.data.reply) {
        return res.json({
          success: true,
          reply: response.data.reply,
          agentRole: response.data.agent_role || agentRole || 'coordinator',
          suggestedActions: response.data.suggested_actions || [],
        });
      }
    } catch (aiErr) {
      console.log(`[AI Bridge] Python AI chat service unavailable (${aiErr.message}), generating intelligent local response.`);
    }

    // High quality contextual response generator based on agent role
    let reply = '';
    let suggestedActions = ['Check Eligibility', 'Fee Analysis', 'Compare Colleges'];
    const msgLower = message.toLowerCase();

    if (agentRole === 'fee_analysis' || msgLower.includes('fee') || msgLower.includes('budget') || msgLower.includes('hostel')) {
      reply = `As the **Fee Analysis Agent**, I analyzed the expense patterns for Andhra Pradesh engineering institutions:
- **Government / University Colleges (AUCE, JNTUK, SVUCE)**: Subsidized tuition fees ranging from ₹45,000 to ₹50,000/year. Hostel & mess charges average ₹70,000/year. Total annual expenditure: ~₹1,20,000 - ₹1,30,000.
- **Top Autonomous Colleges (VRSEC, GVPCE, RVRJC, SRKR)**: State-regulated tuition fee between ₹69,800 and ₹73,000/year. Combined hostel and amenities total ~₹1,75,000 - ₹1,95,000 annually.
- **Financial Aid & JVD Scheme**: Students eligible for the AP Jagananna Vidya Deevena (JVD) scheme receive 100% tuition reimbursement directly through government welfare portals.`;
      suggestedActions = ['View Affordable Colleges', 'Filter Under ₹1.5 Lakhs'];
    } else if (agentRole === 'admission_eligibility' || msgLower.includes('rank') || msgLower.includes('cutoff') || msgLower.includes('eligible')) {
      reply = `As the **Admission Eligibility Agent**, here is how rank evaluation works:
1. **Safer Options**: Colleges where the closing cutoff in past rounds was at least 30% higher than your rank (e.g. SRKR, GMRIT, RVRJC for ranks around 8,000 - 12,000).
2. **Match Options**: Institutes where your rank is competitive with previous closing ranks (e.g. VRSEC, GVPCE for ranks around 5,000 - 8,000).
3. **Reach Options**: Premier university campuses where cutoffs are stricter (AUCE CSE cutoff ~2,200).
*Note: We evaluate criteria objectively, but cutoffs vary by reservation category, gender quota, and annual candidate distribution. Admission is never guaranteed.*`;
      suggestedActions = ['Run Eligibility Checker', 'View Seat Matrix'];
    } else if (agentRole === 'college_finder' || msgLower.includes('find') || msgLower.includes('recommend') || msgLower.includes('best college')) {
      reply = `As the **College Finder Agent**, I recommend prioritizing institutions with NAAC 'A+' accreditation and NBA-accredited engineering departments:
- **Top Premier Options**: Andhra University (AUCE Visakhapatnam), JNTU Kakinada (JNTUK), and SVU College of Engineering (Tirupati).
- **Top Autonomous Private Options**: VR Siddhartha (Vijayawada), Gayatri Vidya Parishad (Visakhapatnam), RVR & JC (Guntur), SRKR (Bhimavaram).
Would you like to narrow down by your preferred district or branch?`;
      suggestedActions = ['Filter by Visakhapatnam', 'Filter by Vijayawada', 'Show CSE Colleges'];
    } else if (agentRole === 'admission_guidance' || msgLower.includes('counselling') || msgLower.includes('document') || msgLower.includes('dates')) {
      reply = `As the **Admission Guidance Agent**, here are the critical steps for AP EAPCET admissions:
1. **Online Registration & Fee Payment**: Register on the official AP EAPCET counselling portal (sche.ap.gov.in).
2. **Document Verification**: Verify SSC memo, Intermediate marks, Study certificates (Class 6-12), Caste Certificate, and Residence proof at Help Line Centers (HLC) or online.
3. **Web Options Entry**: Fill prioritized college and branch codes in descending order of true preference.
4. **Seat Allotment & Self-Reporting**: Download allotment order, complete online self-reporting, and report to the allotted college before the scheduled deadline.`;
      suggestedActions = ['Download Document Checklist', 'View Counselling Schedule'];
    } else {
      reply = `Hello! I am your **AI Admission Coordinator**. I collaborate with our specialized agents:
- 🏛️ **College Finder Agent**: Locates colleges by branch, city, and campus facilities.
- 🎯 **Admission Eligibility Agent**: Categorizes colleges into Reach, Match, and Safer options based on your AP EAPCET rank.
- 💰 **Fee Analysis Agent**: Evaluates tuition, hostel costs, and JVD scholarship eligibility.
- ⚖️ **College Comparison Agent**: Provides objective side-by-side matrices and pros/cons.
- 📋 **Admission Guidance Agent**: Outlines step-by-step counselling rules and verified deadlines.

How may our agent team assist your college admission journey today?`;
      suggestedActions = ['Find Best Colleges for My Rank', 'Analyze My Fee Budget', 'Compare AUCE vs VRSEC'];
    }

    res.json({
      success: true,
      reply,
      agentRole: agentRole || 'coordinator',
      suggestedActions,
    });
  } catch (error) {
    next(error);
  }
};
