// Simple in-memory verification token store
// In production, use a database instead

interface VerificationToken {
  token: string;
  email: string;
  name: string;
  transactionId: string;
  createdAt: number;
  verified: boolean;
}

// Store tokens in memory (resets on server restart)
// For production, move to database
const tokens: Map<string, VerificationToken> = new Map();

export function generateVerificationToken(
  email: string,
  name: string,
  transactionId: string,
): string {
  const token =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  tokens.set(token, {
    token,
    email,
    name,
    transactionId,
    createdAt: Date.now(),
    verified: false,
  });

  return token;
}

export function verifyToken(token: string): VerificationToken | null {
  const tokenData = tokens.get(token);

  if (!tokenData) {
    return null;
  }

  // Token expires after 24 hours
  const expirationTime = 24 * 60 * 60 * 1000;
  if (Date.now() - tokenData.createdAt > expirationTime) {
    tokens.delete(token);
    return null;
  }

  tokenData.verified = true;
  return tokenData;
}

export function getTokenStatus(token: string): {
  verified: boolean;
  email?: string;
} {
  const tokenData = tokens.get(token);

  if (!tokenData) {
    return { verified: false };
  }

  // Check if expired
  const expirationTime = 24 * 60 * 60 * 1000;
  if (Date.now() - tokenData.createdAt > expirationTime) {
    tokens.delete(token);
    return { verified: false };
  }

  return {
    verified: tokenData.verified,
    email: tokenData.email,
  };
}
