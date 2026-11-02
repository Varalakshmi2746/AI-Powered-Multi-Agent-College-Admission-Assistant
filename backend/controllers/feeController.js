import FeeDetails from '../models/FeeDetails.js';
import College from '../models/College.js';
import Student from '../models/Student.js';

export const analyzeFees = async (req, res, next) => {
  try {
    let { annualBudget, hostelRequired } = req.query;

    if (!annualBudget && req.user) {
      const student = await Student.findOne({ userId: req.user._id });
      if (student) {
        annualBudget = student.annualBudget;
        if (hostelRequired === undefined) hostelRequired = student.hostelRequired;
      }
    }

    const budget = Number(annualBudget) || 180000;
    const needHostel = hostelRequired === undefined ? true : String(hostelRequired) === 'true';

    const fees = await FeeDetails.find().populate('collegeId').lean();

    const analysis = fees.map((fee) => {
      const college = fee.collegeId;
      if (!college) return null;

      const effectiveHostelFee = needHostel ? (fee.hostelFeePerYear || 0) + (fee.messFeePerYear || 0) : 0;
      const totalEstimated = fee.tuitionFeePerYear + effectiveHostelFee + (fee.otherFeePerYear || 0);
      const isAffordable = totalEstimated <= budget;
      const difference = budget - totalEstimated; // positive if within budget, negative if exceeds

      let budgetStatus = 'Within Budget';
      if (difference < -50000) {
        budgetStatus = 'Significantly Exceeds Budget';
      } else if (difference < 0) {
        budgetStatus = 'Moderately Over Budget';
      } else if (difference > 50000) {
        budgetStatus = 'Highly Affordable';
      }

      return {
        collegeId: college._id,
        collegeName: college.name,
        collegeCode: college.code,
        city: college.city,
        district: college.district,
        type: college.type,
        tuitionFee: fee.tuitionFeePerYear,
        hostelRent: needHostel ? fee.hostelFeePerYear : 0,
        messFee: needHostel ? fee.messFeePerYear : 0,
        otherExpenses: fee.otherFeePerYear,
        totalAnnualCost: totalEstimated,
        studentBudget: budget,
        variance: difference,
        isAffordable,
        budgetStatus,
        scholarshipAvailable: fee.scholarshipAvailable,
        govtFeeReimbursementEligible: fee.govtFeeReimbursementEligible,
        scholarshipDetails: fee.scholarshipDetails,
      };
    }).filter(Boolean);

    // Sort: affordable first, then lowest cost
    analysis.sort((a, b) => a.totalAnnualCost - b.totalAnnualCost);

    const stats = {
      totalAnalyzed: analysis.length,
      affordableCount: analysis.filter((a) => a.isAffordable).length,
      overBudgetCount: analysis.filter((a) => !a.isAffordable).length,
      minAnnualCost: Math.min(...analysis.map((a) => a.totalAnnualCost)),
      maxAnnualCost: Math.max(...analysis.map((a) => a.totalAnnualCost)),
      avgAnnualCost: Math.round(
        analysis.reduce((acc, curr) => acc + curr.totalAnnualCost, 0) / (analysis.length || 1)
      ),
    };

    res.json({
      success: true,
      budget,
      hostelRequired: needHostel,
      stats,
      colleges: analysis,
    });
  } catch (error) {
    next(error);
  }
};
