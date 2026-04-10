// In-memory user database
// In production, use a real database like MongoDB, PostgreSQL, etc.

export interface User {
  email: string;
  name: string;
  transactionId: string;
  verified: boolean;
  paymentCompleted: boolean;
  createdAt: number;
  verifiedAt?: number;
  paidAt?: number;
}

// Simple in-memory store
const users: Map<string, User> = new Map();

export function registerUser(
  email: string,
  name: string,
  transactionId: string,
): User {
  const user: User = {
    email: email.toLowerCase(),
    name,
    transactionId,
    verified: false,
    paymentCompleted: false,
    createdAt: Date.now(),
  };

  users.set(email.toLowerCase(), user);
  return user;
}

export function getUserByEmail(email: string): User | null {
  return users.get(email.toLowerCase()) || null;
}

export function verifyUserEmail(email: string): User | null {
  const user = users.get(email.toLowerCase());
  if (!user) return null;

  user.verified = true;
  user.verifiedAt = Date.now();
  return user;
}

export function markPaymentComplete(email: string): User | null {
  const user = users.get(email.toLowerCase());
  if (!user) return null;

  user.paymentCompleted = true;
  user.paidAt = Date.now();
  return user;
}

export function getAllUsers(): User[] {
  return Array.from(users.values());
}
