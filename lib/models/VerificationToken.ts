import mongoose, { Schema, Document } from "mongoose";

export interface IVerificationToken extends Document {
  token: string;
  email: string;
  name: string;
  transactionId: string;
  verified: boolean;
  resendCount: number; // track how many times verification email was resent
  createdAt: Date;
  expiresAt: Date;
}

const VerificationTokenSchema = new Schema<IVerificationToken>(
  {
    token: { type: String, required: true, unique: true },
    email: { type: String, required: true, lowercase: true },
    name: { type: String, required: true },
    transactionId: { type: String, required: true },
    verified: { type: Boolean, default: false },
    resendCount: { type: Number, default: 0 }, // track resend attempts for rate limiting
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
      index: { expireAfterSeconds: 0 },
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.VerificationToken ||
  mongoose.model<IVerificationToken>(
    "VerificationToken",
    VerificationTokenSchema,
  );
