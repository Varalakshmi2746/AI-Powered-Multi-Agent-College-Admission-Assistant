import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'College',
      required: true,
    },
    branchName: {
      type: String,
      required: true,
      trim: true,
    },
    branchCode: {
      type: String,
      required: true,
      uppercase: true,
    },
    degree: {
      type: String,
      default: 'B.Tech',
    },
    durationYears: {
      type: Number,
      default: 4,
    },
    intakeSeats: {
      type: Number,
      default: 120,
    },
    accreditationStatus: {
      type: String,
      default: 'NBA Accredited',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Course', courseSchema);
