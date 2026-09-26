import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: 'campaign' | 'reminder' | 'alert' | 'system' | 'recommendation';
  relatedCampaign?: mongoose.Types.ObjectId;
  isRead: boolean;
  actionUrl?: string;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['campaign', 'reminder', 'alert', 'system', 'recommendation'],
      default: 'system',
    },
    relatedCampaign: {
      type: Schema.Types.ObjectId,
      ref: 'Campaign',
    },
    isRead: { type: Boolean, default: false },
    actionUrl: String,
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

export default mongoose.model<INotification>('Notification', notificationSchema);
