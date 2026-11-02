import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    intermediateMarks: {
      type: Number,
      min: 0,
      max: 100,
      default: 85,
    },
    entranceExamName: {
      type: String,
      default: 'AP EAPCET',
      enum: ['AP EAPCET', 'JEE Main', 'JEE Advanced', 'CUET', 'Management / Other'],
    },
    entranceExamRank: {
      type: Number,
      min: 1,
      default: 8500,
    },
    category: {
      type: String,
      enum: ['OC', 'BC-A', 'BC-B', 'BC-C', 'BC-D', 'BC-E', 'SC', 'ST', 'EWS'],
      default: 'OC',
    },
    preferredCourse: {
      type: String,
      default: 'Computer Science and Engineering',
    },
    preferredState: {
      type: String,
      default: 'Andhra Pradesh',
    },
    preferredCity: {
      type: String,
      default: 'All / Any',
    },
    annualBudget: {
      type: Number,
      default: 180000,
    },
    hostelRequired: {
      type: Boolean,
      default: true,
    },
    targetDistrict: {
      type: String,
      default: '',
    },
    academicInterests: [String],
  },
  { timestamps: true }
);

export default mongoose.model('Student', studentSchema);
