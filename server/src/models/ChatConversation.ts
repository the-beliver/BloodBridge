import mongoose, { Document, Schema } from 'mongoose';

export interface IChatConversation extends Document {
  userId: mongoose.Types.ObjectId;
  messages: {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }[];
  context?: string;
}

const chatConversationSchema = new Schema<IChatConversation>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    messages: [
      {
        role: { type: String, enum: ['user', 'assistant'], required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    context: String,
  },
  { timestamps: true }
);

chatConversationSchema.index({ userId: 1 });

export default mongoose.model<IChatConversation>('ChatConversation', chatConversationSchema);
