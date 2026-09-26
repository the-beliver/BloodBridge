import mongoose, { Document, Schema } from 'mongoose';

export interface IAttendance extends Document {
  campaign: mongoose.Types.ObjectId;
  donor: mongoose.Types.ObjectId;
  registration: mongoose.Types.ObjectId;
  markedBy: mongoose.Types.ObjectId;
  markedAt: Date;
  method: 'qr-scan' | 'manual' | 'self-checkin';
  bloodGroup: string;
  notes?: string;
}

const attendanceSchema = new Schema<IAttendance>(
  {
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
    registration: {
      type: Schema.Types.ObjectId,
      ref: 'Registration',
      required: true,
    },
    markedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    markedAt: {
      type: Date,
      default: Date.now,
    },
    method: {
      type: String,
      enum: ['qr-scan', 'manual', 'self-checkin'],
      default: 'manual',
    },
    bloodGroup: String,
    notes: String,
  },
  { timestamps: true }
);

attendanceSchema.index({ campaign: 1, donor: 1 }, { unique: true });
attendanceSchema.index({ campaign: 1 });

export default mongoose.model<IAttendance>('Attendance', attendanceSchema);
