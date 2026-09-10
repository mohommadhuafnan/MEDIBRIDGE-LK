import mongoose, { Document, Schema } from 'mongoose';

export interface IMedicine extends Document {
  brand_name: string;
  generic_name: string;
  active_ingredient: string;
  strength: string;
  strength_value?: number;
  strength_unit?: string;
  dosage_form: string;
  manufacturer: string;
  pack_size: string;
  pack_units: number;
  country: string;
  regulatory_status: 'NMRA_REGISTERED' | 'NMRA_VERIFIED' | 'PROVISIONAL' | 'PENDING';
  nmra_reg_no?: string;
  category: string;
  source: string;
  patient_explanation: {
    what_is_it: string;
    common_uses: string[];
    important_info: string;
    precautions: string[];
  };
  verified: boolean;
  created_at: Date;
  updated_at: Date;
}

const MedicineSchema = new Schema<IMedicine>(
  {
    brand_name: { type: String, required: true, index: true, trim: true },
    generic_name: { type: String, required: true, index: true, trim: true },
    active_ingredient: { type: String, required: true, index: true, trim: true },
    strength: { type: String, required: true, trim: true },
    strength_value: { type: Number },
    strength_unit: { type: String },
    dosage_form: { type: String, required: true, index: true, trim: true },
    manufacturer: { type: String, required: true, trim: true },
    pack_size: { type: String, default: '10 Tablets' },
    pack_units: { type: Number, default: 10 },
    country: { type: String, default: 'Sri Lanka' },
    regulatory_status: {
      type: String,
      enum: ['NMRA_REGISTERED', 'NMRA_VERIFIED', 'PROVISIONAL', 'PENDING'],
      default: 'NMRA_REGISTERED',
    },
    nmra_reg_no: { type: String },
    category: { type: String, required: true, index: true },
    source: { type: String, default: 'NMRA Sri Lanka Gazette' },
    patient_explanation: {
      what_is_it: { type: String, default: '' },
      common_uses: [{ type: String }],
      important_info: { type: String, default: '' },
      precautions: [{ type: String }],
    },
    verified: { type: Boolean, default: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

MedicineSchema.index({ active_ingredient: 1, strength: 1, dosage_form: 1 });
MedicineSchema.index({ brand_name: 'text', generic_name: 'text', active_ingredient: 'text' });

export const Medicine = mongoose.model<IMedicine>('Medicine', MedicineSchema);
