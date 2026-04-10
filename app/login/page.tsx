"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showResendOption, setShowResendOption] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setShowResendOption(false);

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Check if email not verified
        if (data.requiresVerification) {
          setError(
            "Email not verified yet. Please check your email for the verification link.",
          );
          setShowResendOption(true);
        } else if (response.status === 401) {
          setError(data.error || "Invalid email or password");
        } else if (response.status === 404) {
          setError(
            data.error ||
              "No account found with this email. Please sign up first.",
          );
        } else {
          setError(data.error || "Login failed");
        }
        return;
      }

      // Redirect to payment page
      router.push("/payment");
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 to-blue-100 py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">Login to continue with payment</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
                {showResendOption && (
                  <div className="mt-3 pt-3 border-t border-red-200">
                    <p className="text-sm mb-2">
                      Need to resend verification email?
                    </p>
                    <Link
                      href="/signup"
                      className="text-red-700 font-medium hover:underline"
                    >
                      Go back and request resend →
                    </Link>
                  </div>
                )}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="your@email.com"
                disabled={loading}
              />
            </div>

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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login & Continue to Payment"}
            </button>
          </form>

          {/* Info Section */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">
              Make sure your email is verified before logging in.
            </p>
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
