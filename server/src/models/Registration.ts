import mongoose, { Document, Schema } from 'mongoose';

export type RegistrationStatus = 'registered' | 'confirmed' | 'cancelled' | 'attended' | 'no-show';

export interface IRegistration extends Document {
  registrationId: string;
  campaign: mongoose.Types.ObjectId;
  donor: mongoose.Types.ObjectId;
  status: RegistrationStatus;
  bloodGroup: string;
  registeredAt: Date;
  confirmedAt?: Date;
  cancelledAt?: Date;
  attendedAt?: Date;
  qrCode?: string;
  remindersSent: number;
  lastReminderAt?: Date;
  attendanceProbability?: number;
  noShowProbability?: number;
  riskLevel?: 'low' | 'medium' | 'high';
}

const registrationSchema = new Schema<IRegistration>(
  {
    registrationId: {
      type: String,
      required: true,
      unique: true,
    },
    campaign: {
      type: Schema.Types.ObjectId,
      ref: 'Campaign',
      required: true,
    },
    donor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['registered', 'confirmed', 'cancelled', 'attended', 'no-show'],
      default: 'registered',
    },
    bloodGroup: {
      type: String,
      required: true,
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
    confirmedAt: Date,
    cancelledAt: Date,
    attendedAt: Date,
    qrCode: String,
    remindersSent: { type: Number, default: 0 },
    lastReminderAt: Date,
    attendanceProbability: Number,
    noShowProbability: Number,
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
    },
  },
  { timestamps: true }
);

registrationSchema.index({ campaign: 1, donor: 1 }, { unique: true });
registrationSchema.index({ registrationId: 1 });
registrationSchema.index({ status: 1 });
registrationSchema.index({ riskLevel: 1 });

export default mongoose.model<IRegistration>('Registration', registrationSchema);
