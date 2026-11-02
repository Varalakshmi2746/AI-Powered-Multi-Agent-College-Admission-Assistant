import College from '../models/College.js';
import AdmissionCriteria from '../models/AdmissionCriteria.js';
import Student from '../models/Student.js';

export const checkEligibility = async (req, res, next) => {
  try {
    let { rank, intermediateMarks, category, exam, course } = req.body;

    // If user is authenticated, fall back to profile data if not provided
    if (!rank && req.user) {
      const student = await Student.findOne({ userId: req.user._id });
      if (student) {
        rank = student.entranceExamRank;
        intermediateMarks = student.intermediateMarks;
        category = student.category;
        exam = student.entranceExamName;
        course = course || student.preferredCourse;
      }
    }

    rank = Number(rank) || 10000;
    intermediateMarks = Number(intermediateMarks) || 75;
    category = category || 'OC';
    exam = exam || 'AP EAPCET';
    course = course || 'Computer Science and Engineering';

    const allCriteria = await AdmissionCriteria.find({
      branchName: { $regex: course, $options: 'i' },
    }).populate('collegeId').lean();

    const results = allCriteria.map((crit) => {
      const college = crit.collegeId;
      if (!college) return null;

      const closingCutoff =
        (crit.categoryClosingRanks && crit.categoryClosingRanks[category]) || crit.closingRank;
      const openingCutoff = crit.openingRank || Math.floor(closingCutoff * 0.4);

      let statusCategory = 'Match';
      let probabilityScore = 65;
      let explanation = '';

      if (intermediateMarks < crit.minIntermediatePercentage) {
        statusCategory = 'Ineligible';
        probabilityScore = 0;
        explanation = `Does not meet the minimum Class 12 / Intermediate academic benchmark (${crit.minIntermediatePercentage}% required, obtained ${intermediateMarks}%).`;
      } else if (rank <= closingCutoff * 0.7) {
        statusCategory = 'Safer';
        probabilityScore = 92;
        explanation = `Your rank (${rank.toLocaleString()}) is comfortably within the historical closing cutoff (${closingCutoff.toLocaleString()}) for ${category} category. High admission favorability based on past counselling data.`;
      } else if (rank <= closingCutoff * 1.15) {
        statusCategory = 'Match';
        probabilityScore = 68;
        explanation = `Your rank (${rank.toLocaleString()}) is competitive and aligns closely with the expected cutoff range (${openingCutoff.toLocaleString()} - ${closingCutoff.toLocaleString()}) for ${category} category.`;
      } else {
        statusCategory = 'Reach';
        probabilityScore = 35;
        explanation = `Your rank (${rank.toLocaleString()}) exceeds the previous cutoff benchmark (${closingCutoff.toLocaleString()}) for ${category} category. You may consider this as an aspirational target in later counselling phases or sliding rounds.`;
      }

      return {
        collegeId: college._id,
        collegeName: college.name,
        collegeCode: college.code,
        city: college.city,
        district: college.district,
        naacGrade: college.naacGrade,
        nirfRank: college.nirfRank,
        branch: crit.branchName,
        categoryCutoff: closingCutoff,
        openingCutoff,
        studentRank: rank,
        studentCategory: category,
        statusCategory, // Reach, Match, Safer, Ineligible
        probabilityScore,
        explanation,
        disclaimer: 'Admissions in Andhra Pradesh depend on annual candidate seat matrices, category reservations, and web-counselling choices. This benchmark is for guidance only and does not guarantee admission.',
      };
    }).filter(Boolean);

    // Group counts
    const summary = {
      totalAnalyzed: results.length,
      saferCount: results.filter((r) => r.statusCategory === 'Safer').length,
      matchCount: results.filter((r) => r.statusCategory === 'Match').length,
      reachCount: results.filter((r) => r.statusCategory === 'Reach').length,
    };

    res.json({
      success: true,
      query: { rank, intermediateMarks, category, exam, course },
      summary,
      results,
    });
  } catch (error) {
    next(error);
  }
};
