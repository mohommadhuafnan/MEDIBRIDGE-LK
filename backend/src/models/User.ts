import mongoose, { Document, Schema } from 'mongoose';

export type UserRole = 'PATIENT' | 'CAREGIVER' | 'PHARMACIST' | 'HEALTHCARE_PROFESSIONAL' | 'ADMIN';

export interface IUser extends Document {
  firebase_uid?: string;
  email: string;
  password_hash?: string;
  full_name: string;
  role: UserRole;
  preferred_language: 'en' | 'si' | 'ta';
  country: string;
  district?: string;
  city?: string;
  pharmacy_id?: mongoose.Types.ObjectId;
  onboarding_completed: boolean;
  price_notifications: boolean;
  safety_notifications: boolean;
  created_at: Date;
  updated_at: Date;
}

const UserSchema = new Schema<IUser>(
  {
    firebase_uid: { type: String, sparse: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password_hash: { type: String },
    full_name: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: ['PATIENT', 'CAREGIVER', 'PHARMACIST', 'HEALTHCARE_PROFESSIONAL', 'ADMIN'],
      default: 'PATIENT',
    },
    preferred_language: {
      type: String,
      enum: ['en', 'si', 'ta'],
      default: 'en',
    },
    country: { type: String, default: 'Sri Lanka' },
    district: { type: String, default: 'Colombo' },
    city: { type: String, default: 'Colombo' },
    pharmacy_id: { type: Schema.Types.ObjectId, ref: 'Pharmacy' },
    onboarding_completed: { type: Boolean, default: false },
    price_notifications: { type: Boolean, default: true },
    safety_notifications: { type: Boolean, default: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

export const User = mongoose.model<IUser>('User', UserSchema);
