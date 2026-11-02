import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'College',
      required: true,
    },
    branchName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Saved / Draft', 'Applied Online', 'Documents Verified', 'Web Options Frozen', 'Seat Allotted', 'Admitted', 'Withdrawn'],
      default: 'Saved / Draft',
    },
    applicationNumber: {
      type: String,
      default: () => 'APP-' + Math.floor(100000 + Math.random() * 900000),
    },
    counsellingPhase: {
      type: String,
      default: 'Phase 1 Counselling',
    },
    allotmentRank: Number,
    allotmentCategory: String,
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.model('Application', applicationSchema);
