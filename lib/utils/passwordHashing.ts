import crypto from "crypto";
import { promisify } from "util";

const scrypt = promisify(crypto.scrypt);

/**
 * Hash password using scrypt
 * Returns format: salt$hash (base64 encoded)
 */
export async function hashPassword(password: string): Promise<string> {
  // Generate random salt
  const salt = crypto.randomBytes(16).toString("base64");

  // Derive key using scrypt
  try {
    const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
    const hash = derivedKey.toString("base64");

    // Return salt$hash format for easy verification
    return `${salt}$${hash}`;
  } catch (error) {
    throw new Error("Failed to hash password");
  }
}

/**
 * Verify password against hashed password
 * Hashed format should be: salt$hash
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  try {
    // Split salt and hash
    const [salt, hash] = hashedPassword.split("$");

    if (!salt || !hash) {
      throw new Error("Invalid hash format");
    }

    // Derive key using same salt
    const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
    const derivedHash = derivedKey.toString("base64");

    // Compare hashes using constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(derivedHash));
  } catch (error) {
    return false;
  }
}
