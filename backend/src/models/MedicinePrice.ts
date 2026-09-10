import mongoose, { Document, Schema } from 'mongoose';

export type PriceType = 'NMRA_MRP' | 'PHARMACY_SELLING_PRICE' | 'PARTNER_PRICE' | 'ESTIMATED_PRICE';
export type AvailabilityStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'UNKNOWN';

export interface IMedicinePrice extends Document {
  medicine_id: mongoose.Types.ObjectId;
  pharmacy_id?: mongoose.Types.ObjectId;
  pharmacy_name: string;
  price: number;
  unit_price: number;
  currency: string;
  price_type: PriceType;
  effective_from: Date;
  effective_to: Date | null;
  source: string;
  source_document?: string;
  verified_at: Date;
  availability: AvailabilityStatus;
  created_at: Date;
  updated_at: Date;
}

const MedicinePriceSchema = new Schema<IMedicinePrice>(
  {
    medicine_id: { type: Schema.Types.ObjectId, ref: 'Medicine', required: true, index: true },
    pharmacy_id: { type: Schema.Types.ObjectId, ref: 'Pharmacy', index: true },
    pharmacy_name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    unit_price: { type: Number, required: true },
    currency: { type: String, default: 'LKR' },
    price_type: {
      type: String,
      enum: ['NMRA_MRP', 'PHARMACY_SELLING_PRICE', 'PARTNER_PRICE', 'ESTIMATED_PRICE'],
      required: true,
      index: true,
    },
    effective_from: { type: Date, required: true, default: Date.now },
    effective_to: { type: Date, default: null, index: true }, // null means currently active
    source: { type: String, required: true },
    source_document: { type: String },
    verified_at: { type: Date, default: Date.now },
    availability: {
      type: String,
      enum: ['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK', 'UNKNOWN'],
      default: 'IN_STOCK',
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

MedicinePriceSchema.index({ medicine_id: 1, effective_to: 1 });
MedicinePriceSchema.index({ medicine_id: 1, price_type: 1 });

export const MedicinePrice = mongoose.model<IMedicinePrice>('MedicinePrice', MedicinePriceSchema);
