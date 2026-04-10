import { connectDB } from "./mongodb";
import VerificationToken from "./models/VerificationToken";

export async function generateVerificationToken(
  email: string,
  name: string,
  transactionId: string,
) {
  await connectDB();

  const token =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  await VerificationToken.create({
    token,
    email: email.toLowerCase(),
    name,
    transactionId,
  });

  return token;
}

export async function verifyToken(token: string) {
  await connectDB();

  const tokenDoc = await VerificationToken.findOne({ token });

  if (!tokenDoc) {
    return null;
  }

  if (new Date() > tokenDoc.expiresAt) {
    await VerificationToken.deleteOne({ token });
    return null;
  }

  tokenDoc.verified = true;
  await tokenDoc.save();

  return {
    token: tokenDoc.token,
    email: tokenDoc.email,
    name: tokenDoc.name,
    transactionId: tokenDoc.transactionId,
    verified: tokenDoc.verified,
  };
}

export async function getTokenStatus(token: string) {
  await connectDB();

  const tokenDoc = await VerificationToken.findOne({ token });

  if (!tokenDoc) {
    return { verified: false };
  }

  if (new Date() > tokenDoc.expiresAt) {
    await VerificationToken.deleteOne({ token });
    return { verified: false };
  }

  return {
    verified: tokenDoc.verified,
    email: tokenDoc.email,
  };
}
