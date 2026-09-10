import mongoose, { Document, Schema } from 'mongoose';

export type AlertType = 'RECALL' | 'REVOCATION' | 'QUALITY_SAFETY' | 'PRICE_CEILING' | 'ADVISORY';
export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface ISafetyAlert extends Document {
  medicine_id?: mongoose.Types.ObjectId;
  medicine_name: string;
  generic_name?: string;
  batch_number?: string;
  alert_type: AlertType;
  severity: AlertSeverity;
  source: string;
  source_url?: string;
  description: string;
  action_required: string;
  published_at: Date;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

const SafetyAlertSchema = new Schema<ISafetyAlert>(
  {
    medicine_id: { type: Schema.Types.ObjectId, ref: 'Medicine' },
    medicine_name: { type: String, required: true, trim: true },
    generic_name: { type: String, trim: true },
    batch_number: { type: String },
    alert_type: {
      type: String,
      enum: ['RECALL', 'REVOCATION', 'QUALITY_SAFETY', 'PRICE_CEILING', 'ADVISORY'],
      required: true,
    },
    severity: {
      type: String,
      enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'],
      default: 'HIGH',
    },
    source: { type: String, default: 'NMRA Sri Lanka (National Medicines Regulatory Authority)' },
    source_url: { type: String },
    description: { type: String, required: true },
    action_required: { type: String, required: true },
    published_at: { type: Date, default: Date.now },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

export const SafetyAlert = mongoose.model<ISafetyAlert>('SafetyAlert', SafetyAlertSchema);
