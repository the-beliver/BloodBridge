import mongoose, { Document, Schema } from 'mongoose';

export type BloodGroup = 'O+' | 'O-' | 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-';

export interface IDonorProfile extends Document {
  userId: mongoose.Types.ObjectId;
  bloodGroup: BloodGroup;
  dateOfBirth?: Date;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  totalDonations: number;
  lastDonationDate?: Date;
  points: number;
  badges: string[];
  medicalNotes?: string;
}

const donorProfileSchema = new Schema<IDonorProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    bloodGroup: {
      type: String,
      enum: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
      required: [true, 'Blood group is required'],
    },
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer-not-to-say'],
    },
    address: String,
    city: String,
    state: String,
    pincode: String,
    totalDonations: { type: Number, default: 0 },
    lastDonationDate: Date,
    points: { type: Number, default: 0 },
    badges: [{ type: String }],
    medicalNotes: String,
  },
  { timestamps: true }
);

donorProfileSchema.index({ userId: 1 });
donorProfileSchema.index({ bloodGroup: 1 });
donorProfileSchema.index({ city: 1 });

export default mongoose.model<IDonorProfile>('DonorProfile', donorProfileSchema);
