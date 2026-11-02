import mongoose from 'mongoose';

const collegeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    type: {
      type: String,
      enum: ['State University / Govt', 'Autonomous Private', 'Deemed University', 'Private Affiliated'],
      default: 'Autonomous Private',
    },
    city: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      default: 'Andhra Pradesh',
    },
    establishedYear: {
      type: Number,
      default: 1980,
    },
    nirfRank: {
      type: String,
      default: 'Rank 101-150 Band',
    },
    naacGrade: {
      type: String,
      default: 'A+',
    },
    nbaAccredited: {
      type: Boolean,
      default: true,
    },
    website: {
      type: String,
      default: '',
    },
    counsellingCode: {
      type: String,
      default: '',
    },
    contactEmail: {
      type: String,
      default: '',
    },
    contactPhone: {
      type: String,
      default: '',
    },
    facilities: [
      {
        type: String,
      },
    ],
    placementStats: {
      highestPackageLPA: { type: Number, default: 32 },
      averagePackageLPA: { type: Number, default: 6.5 },
      placementRatePercent: { type: Number, default: 85 },
      topRecruiters: [String],
    },
    imageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
    },
    isDemonstrationData: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('College', collegeSchema);
