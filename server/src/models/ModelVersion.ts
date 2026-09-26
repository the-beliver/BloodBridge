import mongoose, { Document, Schema } from 'mongoose';

export interface IModelVersion extends Document {
  version: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  trainedOn: number;
  features: string[];
  isActive: boolean;
  trainingDate: Date;
  notes?: string;
}

const modelVersionSchema = new Schema<IModelVersion>(
  {
    version: { type: String, required: true, unique: true },
    accuracy: { type: Number, required: true },
    precision: { type: Number, default: 0 },
    recall: { type: Number, default: 0 },
    f1Score: { type: Number, default: 0 },
    trainedOn: { type: Number, default: 0 },
    features: [String],
    isActive: { type: Boolean, default: false },
    trainingDate: { type: Date, default: Date.now },
    notes: String,
  },
  { timestamps: true }
);

modelVersionSchema.index({ isActive: 1 });
modelVersionSchema.index({ version: 1 });

export default mongoose.model<IModelVersion>('ModelVersion', modelVersionSchema);
