import mongoose, { Document, Schema } from 'mongoose';

export interface IPharmacy extends Document {
  name: string;
  chain: string;
  license_number: string;
  address: string;
  district: string;
  city: string;
  phone: string;
  email?: string;
  website?: string;
  verified: boolean;
  provides_api: boolean;
  last_price_update: Date;
  opening_hours: string;
  latitude?: number;
  longitude?: number;
  created_at: Date;
  updated_at: Date;
}

const PharmacySchema = new Schema<IPharmacy>(
  {
    name: { type: String, required: true, trim: true },
    chain: { type: String, required: true, trim: true },
    license_number: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    district: { type: String, required: true, index: true },
    city: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    website: { type: String },
    verified: { type: Boolean, default: true },
    provides_api: { type: Boolean, default: false },
    last_price_update: { type: Date, default: Date.now },
    opening_hours: { type: String, default: '8:00 AM - 10:00 PM' },
    latitude: { type: Number },
    longitude: { type: Number },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

export const Pharmacy = mongoose.model<IPharmacy>('Pharmacy', PharmacySchema);
