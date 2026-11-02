import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    agentRole: {
      type: String,
      enum: [
        'coordinator',
        'college_finder',
        'admission_eligibility',
        'fee_analysis',
        'college_comparison',
        'admission_guidance',
        'general',
      ],
      default: 'coordinator',
    },
    text: {
      type: String,
      required: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const chatHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sessionTitle: {
      type: String,
      default: 'College Admission Discussion',
    },
    messages: [messageSchema],
  },
  { timestamps: true }
);

export default mongoose.model('ChatHistory', chatHistorySchema);
