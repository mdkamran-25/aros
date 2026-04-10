/**
 * Password validation rules:
 * - Minimum 8 characters
 * - At least 1 uppercase letter (A-Z)
 * - At least 1 lowercase letter (a-z)
 * - At least 1 number (0-9)
 * - At least 1 special character (!@#$%^&*)
 */

export interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];

  if (!password) {
    errors.push("Password is required");
    return { valid: false, errors };
  }

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least 1 uppercase letter (A-Z)");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least 1 lowercase letter (a-z)");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least 1 number (0-9)");
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push(
      "Password must contain at least 1 special character (!@#$%^&*)",
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Check if passwords match
 */
export function passwordsMatch(
  password: string,
  confirmPassword: string,
): boolean {
  return password === confirmPassword && password.length > 0;
}

/**
 * Combine validation and matching check
 */
export function validatePasswordAndConfirm(
  password: string,
  confirmPassword: string,
): PasswordValidationResult {
  const validationResult = validatePassword(password);

  if (!validationResult.valid) {
    return validationResult;
  }

  if (!passwordsMatch(password, confirmPassword)) {
    return {
      valid: false,
      errors: ["Passwords do not match"],
    };
  }

  return {
    valid: true,
    errors: [],
  };
}
