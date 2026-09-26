import mongoose, { Document, Schema } from 'mongoose';

export interface IPrediction extends Document {
  campaign: mongoose.Types.ObjectId;
  registration?: mongoose.Types.ObjectId;
  donor?: mongoose.Types.ObjectId;
  type: 'donor-risk' | 'campaign-turnout';
  attendanceProbability: number;
  noShowProbability: number;
  riskLevel: 'low' | 'medium' | 'high';
  predictedTurnout?: number;
  predictedNoShow?: number;
  features: Record<string, any>;
  reasons: string[];
  modelVersion: string;
  predictedAt: Date;
}

const predictionSchema = new Schema<IPrediction>(
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
      enum: ['donor-risk', 'campaign-turnout'],
      required: true,
    },
    attendanceProbability: { type: Number, required: true },
    noShowProbability: { type: Number, required: true },
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      required: true,
    },
    predictedTurnout: Number,
    predictedNoShow: Number,
    features: { type: Schema.Types.Mixed, default: {} },
    reasons: [String],
    modelVersion: { type: String, default: '1.0' },
    predictedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

predictionSchema.index({ campaign: 1 });
predictionSchema.index({ donor: 1 });
predictionSchema.index({ type: 1 });

export default mongoose.model<IPrediction>('Prediction', predictionSchema);
