import mongoose, { Document, Schema } from 'mongoose';

export interface IOrganizerProfile extends Document {
  userId: mongoose.Types.ObjectId;
  organization: string;
  designation?: string;
  organizationType?: string;
  website?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  totalCampaigns: number;
}

const organizerProfileSchema = new Schema<IOrganizerProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    organization: {
      type: String,
      required: [true, 'Organization name is required'],
      trim: true,
    },
    designation: String,
    organizationType: {
      type: String,
      enum: ['hospital', 'ngo', 'college', 'corporate', 'government', 'other'],
    },
    website: String,
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    totalCampaigns: { type: Number, default: 0 },
  },
  { timestamps: true }
);

organizerProfileSchema.index({ userId: 1 });
organizerProfileSchema.index({ organization: 1 });

export default mongoose.model<IOrganizerProfile>('OrganizerProfile', organizerProfileSchema);
