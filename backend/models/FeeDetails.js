import mongoose from 'mongoose';

const feeDetailsSchema = new mongoose.Schema(
  {
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'College',
      required: true,
      unique: true,
    },
    tuitionFeePerYear: {
      type: Number,
      required: true,
      default: 70000,
    },
    hostelFeePerYear: {
      type: Number,
      default: 65000,
    },
    messFeePerYear: {
      type: Number,
      default: 35000,
    },
    otherFeePerYear: {
      type: Number,
      default: 10000,
    },
    totalEstimatedAnnual: {
      type: Number,
      default: 180000,
    },
    scholarshipAvailable: {
      type: Boolean,
      default: true,
    },
    govtFeeReimbursementEligible: {
      type: Boolean,
      default: true, // Jagananna Vidya Deevena (JVD) scheme eligible
    },
    scholarshipDetails: {
      type: String,
      default: 'Eligible for AP Jagananna Vidya Deevena (full tuition fee reimbursement) for eligible white ration card holders.',
    },
  },
  { timestamps: true }
);

// Auto calculate total
feeDetailsSchema.pre('save', function (next) {
  this.totalEstimatedAnnual =
    this.tuitionFeePerYear + this.hostelFeePerYear + this.messFeePerYear + this.otherFeePerYear;
  next();
});

export default mongoose.model('FeeDetails', feeDetailsSchema);
