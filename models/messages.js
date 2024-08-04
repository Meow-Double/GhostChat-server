import mongoose from 'mongoose';

const MessagesSchema = new mongoose.Schema(
  {
    messages: {
      type: Array,
      default: [],
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model('messages', MessagesSchema);
