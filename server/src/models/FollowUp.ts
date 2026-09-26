import mongoose, { Document, Schema } from 'mongoose';

export interface IFollowUp extends Document {
  campaign: mongoose.Types.ObjectId;
  registration: mongoose.Types.ObjectId;
  donor: mongoose.Types.ObjectId;
  assignedTo?: mongoose.Types.ObjectId;
  channel: 'email' | 'sms' | 'whatsapp' | 'volunteer-call';
  status: 'pending' | 'in-progress' | 'completed' | 'failed' | 'skipped';
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  outcome?: 'confirmed' | 'declined' | 'no-response' | 'rescheduled';
  scheduledAt?: Date;
  completedAt?: Date;
}

const followUpSchema = new Schema<IFollowUp>(
  {
    campaign: {
      type: Schema.Types.ObjectId,
      ref: 'Campaign',
      required: true,
    },
    registration: {
      type: Schema.Types.ObjectId,
      ref: 'Registration',
      required: true,
    },
    donor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    channel: {
      type: String,
      enum: ['email', 'sms', 'whatsapp', 'volunteer-call'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'failed', 'skipped'],
      default: 'pending',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    notes: String,
    outcome: {
      type: String,
      enum: ['confirmed', 'declined', 'no-response', 'rescheduled'],
    },
    scheduledAt: Date,
    completedAt: Date,
  },
  { timestamps: true }
);

followUpSchema.index({ campaign: 1, assignedTo: 1 });
followUpSchema.index({ status: 1 });

export default mongoose.model<IFollowUp>('FollowUp', followUpSchema);
