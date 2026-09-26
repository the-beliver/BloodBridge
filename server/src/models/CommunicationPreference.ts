import mongoose, { Document, Schema } from 'mongoose';

export interface ICommunicationPreference extends Document {
  userId: mongoose.Types.ObjectId;
  email: boolean;
  sms: boolean;
  whatsapp: boolean;
  volunteerCall: boolean;
  preferredLanguage: string;
  quietHoursStart?: string;
  quietHoursEnd?: string;
}

const communicationPreferenceSchema = new Schema<ICommunicationPreference>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: true },
    whatsapp: { type: Boolean, default: true },
    volunteerCall: { type: Boolean, default: true },
    preferredLanguage: { type: String, default: 'english' },
    quietHoursStart: String,
    quietHoursEnd: String,
  },
  { timestamps: true }
);

communicationPreferenceSchema.index({ userId: 1 });

export default mongoose.model<ICommunicationPreference>(
  'CommunicationPreference',
  communicationPreferenceSchema
);
