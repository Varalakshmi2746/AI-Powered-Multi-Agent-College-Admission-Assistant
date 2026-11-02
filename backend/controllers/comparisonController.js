import College from '../models/College.js';
import FeeDetails from '../models/FeeDetails.js';
import Course from '../models/Course.js';
import AdmissionCriteria from '../models/AdmissionCriteria.js';

export const compareColleges = async (req, res, next) => {
  try {
    const { collegeIds } = req.body;

    if (!collegeIds || !Array.isArray(collegeIds) || collegeIds.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least two college IDs to compare',
      });
    }

    const colleges = await College.find({ _id: { $in: collegeIds } }).lean();

    const [allFees, allCourses, allCriteria] = await Promise.all([
      FeeDetails.find({ collegeId: { $in: collegeIds } }).lean(),
      Course.find({ collegeId: { $in: collegeIds } }).lean(),
      AdmissionCriteria.find({ collegeId: { $in: collegeIds } }).lean(),
    ]);

    const feeMap = new Map(allFees.map((f) => [f.collegeId.toString(), f]));
    const courseMap = new Map();
    const criteriaMap = new Map();

    allCourses.forEach((crs) => {
      const cid = crs.collegeId.toString();
      if (!courseMap.has(cid)) courseMap.set(cid, []);
      courseMap.get(cid).push(crs);
    });

    allCriteria.forEach((crit) => {
      const cid = crit.collegeId.toString();
      if (!criteriaMap.has(cid)) criteriaMap.set(cid, []);
      criteriaMap.get(cid).push(crit);
    });

    const detailedColleges = colleges.map((col) => {
      const cid = col._id.toString();
      const fee = feeMap.get(cid) || {
        tuitionFeePerYear: 70000,
        hostelFeePerYear: 60000,
        messFeePerYear: 35000,
        otherFeePerYear: 10000,
        totalEstimatedAnnual: 175000,
      };
      const courses = courseMap.get(cid) || [];
      const criteria = criteriaMap.get(cid) || [];

      // Generate intelligent strengths and considerations
      const pros = [];
      const cons = [];

      if (col.type.includes('Govt') || col.type.includes('State University')) {
        pros.push('Highly prestigious State University degree with established brand recognition');
        pros.push('Extremely affordable subsidized government fee structure');
      } else {
        pros.push('Modern autonomous academic curriculum revised with top industry inputs');
        pros.push('Extensive campus placements and corporate engagement drives');
      }

      if (col.placementStats?.averagePackageLPA >= 7.0) {
        pros.push(`Above average placement packages (~${col.placementStats.averagePackageLPA} LPA)`);
      }
      if (col.placementStats?.highestPackageLPA >= 35.0) {
        pros.push(`High package ceiling observed (~${col.placementStats.highestPackageLPA} LPA)`);
      }
      if (col.naacGrade.includes('A++') || col.naacGrade.includes('A+')) {
        pros.push(`Top tier NAAC ${col.naacGrade} accredited institution`);
      }

      if (fee.totalEstimatedAnnual > 250000) {
        cons.push('Higher annual expenditure compared to state-subsidized universities');
      }
      if (col.type.includes('Govt') && fee.hostelFeePerYear < 45000) {
        cons.push('Hostel and campus infrastructure is vintage compared to modern private universities');
      }
      if (courses.length < 4) {
        cons.push('Limited specialized branch electives available');
      }

      return {
        id: col._id,
        name: col.name,
        code: col.code,
        type: col.type,
        city: col.city,
        district: col.district,
        state: col.state,
        establishedYear: col.establishedYear,
        nirfRank: col.nirfRank,
        naacGrade: col.naacGrade,
        nbaAccredited: col.nbaAccredited,
        website: col.website,
        facilities: col.facilities,
        placementStats: col.placementStats,
        fee: {
          tuition: fee.tuitionFeePerYear,
          hostel: fee.hostelFeePerYear,
          mess: fee.messFeePerYear,
          other: fee.otherFeePerYear,
          totalAnnual: fee.totalEstimatedAnnual,
          govtReimbursement: fee.govtFeeReimbursementEligible,
        },
        courseList: courses.map((c) => ({
          name: c.branchName,
          code: c.branchCode,
          seats: c.intakeSeats,
        })),
        cutoffCSE: criteria.find((c) => c.branchName.includes('Computer Science'))?.closingRank || 'N/A',
        pros,
        cons,
      };
    });

    // Comparison summary metrics
    const cheapest = [...detailedColleges].sort((a, b) => a.fee.totalAnnual - b.fee.totalAnnual)[0];
    const bestPlacements = [...detailedColleges].sort(
      (a, b) => (b.placementStats?.averagePackageLPA || 0) - (a.placementStats?.averagePackageLPA || 0)
    )[0];

    res.json({
      success: true,
      colleges: detailedColleges,
      comparisonSummary: {
        mostBudgetFriendly: cheapest.name,
        highestAvgPlacement: `${bestPlacements.name} (${bestPlacements.placementStats.averagePackageLPA} LPA)`,
        recommendationTip:
          'For maximum value-for-money, prioritize Government universities if your rank qualifies. For contemporary industry electives and modern campus labs, autonomous institutes offer solid competitive placement pipelines.',
      },
    });
  } catch (error) {
    next(error);
  }
};
