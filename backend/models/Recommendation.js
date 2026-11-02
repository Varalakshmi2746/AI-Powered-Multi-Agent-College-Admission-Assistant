import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    querySummary: {
      rank: Number,
      exam: String,
      course: String,
      budget: Number,
      location: String,
    },
    recommendations: [
      {
        collegeId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'College',
        },
        collegeName: String,
        branch: String,
        category: {
          type: String,
          enum: ['Reach', 'Match', 'Safer'],
          required: true,
        },
        confidenceScore: {
          type: Number,
          min: 0,
          max: 100,
        },
        reasons: [String],
        pros: [String],
        cons: [String],
        tuitionFee: Number,
        hostelFee: Number,
        totalAnnualExpense: Number,
        isAffordable: Boolean,
        location: String,
      },
    ],
    agentInsights: {
      finderSummary: String,
      eligibilitySummary: String,
      feeSummary: String,
      guidanceSummary: String,
      coordinatorVerdict: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Recommendation', recommendationSchema);
