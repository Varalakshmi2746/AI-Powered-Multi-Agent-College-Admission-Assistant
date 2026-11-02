import mongoose from 'mongoose';

const admissionCriteriaSchema = new mongoose.Schema(
  {
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'College',
      required: true,
    },
    branchName: {
      type: String,
      required: true,
    },
    examType: {
      type: String,
      default: 'AP EAPCET',
    },
    academicYear: {
      type: String,
      default: '2025-2026',
    },
    minIntermediatePercentage: {
      type: Number,
      default: 45,
    },
    openingRank: {
      type: Number,
      default: 1200,
    },
    closingRank: {
      type: Number,
      default: 9500,
    },
    categoryClosingRanks: {
      OC: { type: Number, default: 8500 },
      BCA: { type: Number, default: 12500 },
      BCB: { type: Number, default: 11000 },
      BCC: { type: Number, default: 15000 },
      BCD: { type: Number, default: 10500 },
      BCE: { type: Number, default: 14000 },
      SC: { type: Number, default: 28000 },
      ST: { type: Number, default: 35000 },
      EWS: { type: Number, default: 9500 },
    },
    counsellingRounds: [
      {
        roundNumber: Number,
        startDate: String,
        endDate: String,
        status: { type: String, default: 'Upcoming' },
      },
    ],
    notes: {
      type: String,
      default: 'Cutoffs are demonstration benchmarks derived from historical AP State counselling data. Actual cutoffs vary each academic round.',
    },
  },
  { timestamps: true }
);

export default mongoose.model('AdmissionCriteria', admissionCriteriaSchema);
