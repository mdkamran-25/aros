import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  name: string;
  password?: string; // hashed password (optional for backward compatibility)
  transactionId: string;
  verified: boolean;
  paymentCompleted: boolean;
  createdAt: Date;
  verifiedAt?: Date;
  paidAt?: Date;
  lastEmailVerificationSent?: Date; // for rate limiting resend verification emails
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    name: { type: String, required: true },
    password: { type: String }, // hashed password
    transactionId: { type: String, required: true, unique: true },
    verified: { type: Boolean, default: false },
    paymentCompleted: { type: Boolean, default: false },
    verifiedAt: { type: Date },
    paidAt: { type: Date },
    lastEmailVerificationSent: { type: Date }, // track for rate limiting resends
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
