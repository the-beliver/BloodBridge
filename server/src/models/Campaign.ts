import mongoose, { Document, Schema } from 'mongoose';

export type CampaignStatus = 'draft' | 'published' | 'active' | 'completed' | 'cancelled';

export interface IBloodGroupTarget {
  bloodGroup: string;
  required: number;
  registered: number;
  confirmed: number;
  predicted: number;
  actual: number;
}

export interface ICampaign extends Document {
  name: string;
  description: string;
  organizer: mongoose.Types.ObjectId;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  address: string;
  city: string;
  state: string;
  contact: string;
  targetDonors: number;
  bloodGroupTargets: IBloodGroupTarget[];
  registrationDeadline: Date;
  status: CampaignStatus;
  qrCode?: string;
  registrationLink?: string;
  registrationCount: number;
  confirmedCount: number;
  attendedCount: number;
  predictedTurnout?: number;
  predictedNoShow?: number;
  turnoutRescueActive: boolean;
  tags: string[];
  bannerImage?: string;
}

const bloodGroupTargetSchema = new Schema<IBloodGroupTarget>(
  {
    bloodGroup: { type: String, required: true },
    required: { type: Number, default: 0 },
    registered: { type: Number, default: 0 },
    confirmed: { type: Number, default: 0 },
    predicted: { type: Number, default: 0 },
    actual: { type: Number, default: 0 },
  },
  { _id: false }
);

const campaignSchema = new Schema<ICampaign>(
  {
    name: {
      type: String,
      required: [true, 'Campaign name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    organizer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: [true, 'Campaign date is required'],
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    contact: {
      type: String,
      required: [true, 'Contact is required'],
    },
    targetDonors: {
      type: Number,
      required: [true, 'Target donors is required'],
      min: 1,
    },
    bloodGroupTargets: [bloodGroupTargetSchema],
    registrationDeadline: {
      type: Date,
      required: [true, 'Registration deadline is required'],
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'active', 'completed', 'cancelled'],
      default: 'draft',
    },
    qrCode: String,
    registrationLink: String,
    registrationCount: { type: Number, default: 0 },
    confirmedCount: { type: Number, default: 0 },
    attendedCount: { type: Number, default: 0 },
    predictedTurnout: Number,
    predictedNoShow: Number,
    turnoutRescueActive: { type: Boolean, default: false },
    tags: [String],
    bannerImage: String,
  },
  { timestamps: true }
);

campaignSchema.index({ organizer: 1 });
campaignSchema.index({ status: 1 });
campaignSchema.index({ date: 1 });
campaignSchema.index({ city: 1 });

export default mongoose.model<ICampaign>('Campaign', campaignSchema);
