import mongoose, { Document, Schema } from 'mongoose';

export interface IPrescriptionItem {
  detected_name: string;
  active_ingredient?: string;
  strength?: string;
  dosage_form?: string;
  dosage_instructions?: string;
  duration?: string;
  quantity?: number;
  confidence: number; // 0 to 1
  matched_medicine_id?: mongoose.Types.ObjectId;
  matched_brand?: string;
  estimated_price?: number;
  lowest_comparable_price?: number;
  potential_savings?: number;
  user_verified?: boolean;
}

export interface IPrescription extends Document {
  user_id: mongoose.Types.ObjectId;
  image_url?: string;
  patient_name?: string;
  doctor_name?: string;
  clinic_name?: string;
  prescription_date?: Date;
  raw_ocr_text?: string;
  extracted_items: IPrescriptionItem[];
  confirmed_items: IPrescriptionItem[];
  total_estimated_cost: number;
  total_comparable_cost: number;
  total_potential_savings: number;
  savings_percentage: number;
  status: 'PENDING_CONFIRMATION' | 'CONFIRMED' | 'ANALYZED' | 'ARCHIVED';
  created_at: Date;
  updated_at: Date;
}

const PrescriptionItemSchema = new Schema<IPrescriptionItem>({
  detected_name: { type: String, required: true },
  active_ingredient: { type: String },
  strength: { type: String },
  dosage_form: { type: String },
  dosage_instructions: { type: String },
  duration: { type: String },
  quantity: { type: Number, default: 10 },
  confidence: { type: Number, default: 0.9 },
  matched_medicine_id: { type: Schema.Types.ObjectId, ref: 'Medicine' },
  matched_brand: { type: String },
  estimated_price: { type: Number, default: 0 },
  lowest_comparable_price: { type: Number, default: 0 },
  potential_savings: { type: Number, default: 0 },
  user_verified: { type: Boolean, default: false },
});

const PrescriptionSchema = new Schema<IPrescription>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    image_url: { type: String },
    patient_name: { type: String },
    doctor_name: { type: String },
    clinic_name: { type: String },
    prescription_date: { type: Date, default: Date.now },
    raw_ocr_text: { type: String },
    extracted_items: [PrescriptionItemSchema],
    confirmed_items: [PrescriptionItemSchema],
    total_estimated_cost: { type: Number, default: 0 },
    total_comparable_cost: { type: Number, default: 0 },
    total_potential_savings: { type: Number, default: 0 },
    savings_percentage: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['PENDING_CONFIRMATION', 'CONFIRMED', 'ANALYZED', 'ARCHIVED'],
      default: 'PENDING_CONFIRMATION',
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

export const Prescription = mongoose.model<IPrescription>('Prescription', PrescriptionSchema);
