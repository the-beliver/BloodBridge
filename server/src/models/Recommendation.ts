import mongoose, { Document, Schema } from 'mongoose';

export interface IRecommendation extends Document {
  campaign: mongoose.Types.ObjectId;
  registration?: mongoose.Types.ObjectId;
  donor?: mongoose.Types.ObjectId;
  type: 'follow-up' | 'reminder' | 'rescue' | 'message' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  channel: 'email' | 'sms' | 'whatsapp' | 'volunteer-call';
  message: string;
  language: string;
  scheduledFor?: Date;
  status: 'pending' | 'approved' | 'rejected' | 'sent' | 'failed';
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  rejectedBy?: mongoose.Types.ObjectId;
  rejectedAt?: Date;
  editedMessage?: string;
  reason: string;
  aiGenerated: boolean;
}

const recommendationSchema = new Schema<IRecommendation>(
  {
    campaign: {
      type: Schema.Types.ObjectId,
      ref: 'Campaign',
      required: true,
    },
    registration: {
      type: Schema.Types.ObjectId,
      ref: 'Registration',
    },
    donor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    type: {
      type: String,
      enum: ['follow-up', 'reminder', 'rescue', 'message', 'general'],
      required: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    channel: {
      type: String,
      enum: ['email', 'sms', 'whatsapp', 'volunteer-call'],
      default: 'email',
    },
    message: { type: String, required: true },
    language: { type: String, default: 'english' },
    scheduledFor: Date,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'sent', 'failed'],
      default: 'pending',
    },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    approvedAt: Date,
    rejectedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    rejectedAt: Date,
    editedMessage: String,
    reason: { type: String, default: '' },
    aiGenerated: { type: Boolean, default: true },
  },
  { timestamps: true }
);

recommendationSchema.index({ campaign: 1, status: 1 });
recommendationSchema.index({ donor: 1 });

export default mongoose.model<IRecommendation>('Recommendation', recommendationSchema);
