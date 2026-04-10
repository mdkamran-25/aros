import { connectDB } from "./mongodb";
import User from "./models/User";

export async function registerUser(
  email: string,
  name: string,
  transactionId: string,
  password?: string, // hashed password
) {
  await connectDB();

  try {
    const user = await User.create({
      email: email.toLowerCase(),
      name,
      password,
      transactionId,
    });
    return user;
  } catch (error: any) {
    if (error.code === 11000) {
      // Duplicate key error
      throw new Error("Email already registered");
    }
    throw error;
  }
}

export async function getUserByEmail(email: string) {
  await connectDB();

  const user = await User.findOne({ email: email.toLowerCase() });
  return user;
}

export async function verifyUserEmail(email: string) {
  await connectDB();

  const user = await User.findOneAndUpdate(
    { email: email.toLowerCase() },
    {
      verified: true,
      verifiedAt: new Date(),
    },
    { new: true },
  );

  return user;
}

export async function markPaymentComplete(email: string) {
  await connectDB();

  const user = await User.findOneAndUpdate(
    { email: email.toLowerCase() },
    {
      paymentCompleted: true,
      paidAt: new Date(),
    },
    { new: true },
  );

  return user;
}

export async function getAllUsers() {
  await connectDB();

  const users = await User.find({});
  return users;
}

/**
 * Check if email exists in database
 */
export async function emailExists(email: string): Promise<boolean> {
  await connectDB();

  const user = await User.findOne({ email: email.toLowerCase() });
  return !!user;
}

/**
 * Get user by transaction ID
 */
export async function getUserByTransactionId(transactionId: string) {
  await connectDB();

  const user = await User.findOne({ transactionId });
  return user;
}

/**
 * Update user's last email verification sent timestamp
 * Used for rate limiting resend verification emails
 */
export async function updateLastEmailVerificationSent(email: string) {
  await connectDB();

  const user = await User.findOneAndUpdate(
    { email: email.toLowerCase() },
    {
      lastEmailVerificationSent: new Date(),
    },
    { new: true },
  );

  return user;
}
