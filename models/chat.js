import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    chats: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true },
);

export default mongoose.model('chat', ChatSchema);
