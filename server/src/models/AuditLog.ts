import mongoose, { Document, Schema } from 'mongoose';

export interface IAuditLog extends Document {
  userId: mongoose.Types.ObjectId;
  action: string;
  resource: string;
  resourceId?: mongoose.Types.ObjectId;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: { type: String, required: true },
    resource: { type: String, required: true },
    resourceId: Schema.Types.ObjectId,
    details: String,
    ipAddress: String,
    userAgent: String,
  },
  { timestamps: true }
);

auditLogSchema.index({ userId: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ createdAt: -1 });

export default mongoose.model<IAuditLog>('AuditLog', auditLogSchema);
