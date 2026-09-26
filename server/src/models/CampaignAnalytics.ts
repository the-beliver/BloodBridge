import mongoose, { Document, Schema } from 'mongoose';

export interface ICampaignAnalytics extends Document {
  campaign: mongoose.Types.ObjectId;
  totalRegistered: number;
  totalConfirmed: number;
  totalAttended: number;
  totalNoShow: number;
  totalCancelled: number;
  predictedTurnout: number;
  actualTurnout: number;
  turnoutRate: number;
  noShowRate: number;
  predictionAccuracy: number;
  bloodGroupDistribution: Record<string, number>;
  riskDistribution: { low: number; medium: number; high: number };
  followUpEffectiveness: number;
  recommendations: { total: number; approved: number; rejected: number };
  generatedAt: Date;
}

const campaignAnalyticsSchema = new Schema<ICampaignAnalytics>(
  {
    campaign: {
      type: Schema.Types.ObjectId,
      ref: 'Campaign',
      required: true,
      unique: true,
    },
    totalRegistered: { type: Number, default: 0 },
    totalConfirmed: { type: Number, default: 0 },
    totalAttended: { type: Number, default: 0 },
    totalNoShow: { type: Number, default: 0 },
    totalCancelled: { type: Number, default: 0 },
    predictedTurnout: { type: Number, default: 0 },
    actualTurnout: { type: Number, default: 0 },
    turnoutRate: { type: Number, default: 0 },
    noShowRate: { type: Number, default: 0 },
    predictionAccuracy: { type: Number, default: 0 },
    bloodGroupDistribution: { type: Schema.Types.Mixed, default: {} },
    riskDistribution: {
      low: { type: Number, default: 0 },
      medium: { type: Number, default: 0 },
      high: { type: Number, default: 0 },
    },
    followUpEffectiveness: { type: Number, default: 0 },
    recommendations: {
      total: { type: Number, default: 0 },
      approved: { type: Number, default: 0 },
      rejected: { type: Number, default: 0 },
    },
    generatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

campaignAnalyticsSchema.index({ campaign: 1 });

export default mongoose.model<ICampaignAnalytics>('CampaignAnalytics', campaignAnalyticsSchema);
