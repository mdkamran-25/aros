"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { validatePassword } from "@/lib/utils/passwordValidator";

export default function EntryForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [emailCheckLoading, setEmailCheckLoading] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [emailChecked, setEmailChecked] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear password errors when user changes password
    if (name === "password" || name === "confirmPassword") {
      setPasswordErrors([]);
    }
  };

  // Check if email already exists
  const handleEmailBlur = async () => {
    if (!formData.email.trim()) {
      setEmailChecked(false);
      setEmailExists(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setEmailChecked(true);
      setEmailExists(false);
      return;
    }

    setEmailCheckLoading(true);
    try {
      const response = await fetch("/api/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();
      setEmailExists(data.exists || false);
      setEmailChecked(true);
    } catch (err) {
      console.error("Email check failed:", err);
      setEmailChecked(false);
    } finally {
      setEmailCheckLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setPasswordErrors([]);

    // Validate all fields
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password.trim()
    ) {
      setError("Please fill in all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Check if email already exists
    if (emailExists) {
      setError("This email is already registered. Please log in instead.");
      return;
    }

    // Validate password
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) {
      setPasswordErrors(passwordValidation.errors);
      setError("Please fix the password requirements");
      return;
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          amount: "0.99",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Signup failed");
        return;
      }

      // Redirect to signup confirmation page
      router.push(`/signup/confirm?transactionId=${data.transactionId}`);
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Name Field */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Full Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder:text-gray-400"
          placeholder="John Doe"
          disabled={loading}
        />
      </div>

      {/* Email Field */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email Address *
        </label>
        <div className="flex gap-2 items-end">
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleEmailBlur}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder:text-gray-400"
            placeholder="your@email.com"
            disabled={loading}
          />
          {emailCheckLoading && (
            <span className="text-gray-500 text-xs">Checking...</span>
          )}
        </div>
        {emailChecked && !emailCheckLoading && (
          <div className="mt-1">
            {emailExists ? (
              <p className="text-red-600 text-xs">
                ✗ This email is already registered
              </p>
            ) : (
              <p className="text-green-600 text-xs">✓ Email available</p>
            )}
          </div>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Password *
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 placeholder:text-gray-400 ${
            passwordErrors.length > 0
              ? "border-red-300 focus:ring-red-500"
              : "border-gray-300 focus:ring-yellow-500"
          }`}
          placeholder="Min 8 chars, uppercase, number, special"
          disabled={loading}
        />
        {passwordErrors.length > 0 && (
          <div className="mt-2 space-y-1">
            {passwordErrors.map((error, idx) => (
              <p key={idx} className="text-red-600 text-xs">
                ✗ {error}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Confirm Password Field */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Confirm Password *
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder:text-gray-400"
          placeholder="Re-enter your password"
          disabled={loading}
        />
        {formData.password &&
          formData.confirmPassword &&
          formData.password === formData.confirmPassword && (
            <p className="mt-1 text-green-600 text-xs">✓ Passwords match</p>
          )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || emailExists || emailCheckLoading}
        className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
      >
        {loading ? "Processing..." : "Enter the Challenge"}
      </button>

      <p className="text-xs text-gray-500 text-center">
        By entering, you agree to the competition terms and privacy policy.
      </p>
    </form>
  );
}
