"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";

function ConfirmContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const transactionId = searchParams.get("transactionId");

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState<string>("24:00:00");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [resendError, setResendError] = useState("");
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(
    null,
  );

  // Fetch user data and verification status
  useEffect(() => {
    if (!transactionId) {
      setError("No transaction ID provided");
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `/api/user-by-transaction?transactionId=${transactionId}`,
        );

        if (!response.ok) {
          setError("Failed to load user data");
          setLoading(false);
          return;
        }

        const data = await response.json();
        setUser(data.user);
        setLoading(false);

        // If already verified, redirect to payment
        if (data.user.verified) {
          setTimeout(() => {
            router.push("/payment");
          }, 2000);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data");
        setLoading(false);
      }
    };

    fetchUserData();

    // Set up polling to check verification status every 5 seconds
    const interval = setInterval(fetchUserData, 5000);
    setPollingInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [transactionId, router]);

  // Countdown timer for token expiration (24 hours)
  useEffect(() => {
    const startTime = Date.now();
    const expirationTime = startTime + 24 * 60 * 60 * 1000;

    const updateTimer = () => {
      const now = Date.now();
      const timeRemaining = expirationTime - now;

      if (timeRemaining <= 0) {
        setTimeLeft("Expired");
        return;
      }

      const hours = Math.floor(
        (timeRemaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000),
      );
      const minutes = Math.floor(
        (timeRemaining % (60 * 60 * 1000)) / (60 * 1000),
      );
      const seconds = Math.floor((timeRemaining % (60 * 1000)) / 1000);

      setTimeLeft(
        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
      );
    };

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  const handleResendEmail = async () => {
    if (!transactionId) return;

    setResendLoading(true);
    setResendMessage("");
    setResendError("");

    try {
      const response = await fetch("/api/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId }),
      });

      const data = await response.json();

      if (!response.ok) {
        setResendError(data.error || "Failed to resend verification email");
        return;
      }

      setResendMessage("Verification email resent! Check your inbox.");
    } catch (err) {
      console.error("Resend error:", err);
      setResendError("An error occurred. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-blue-100">
        <div className="text-center">
          <div className="inline-block animate-spin mb-4">
            <svg
              className="w-12 h-12 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          <p className="text-gray-600">Loading confirmation...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <main className="min-h-screen bg-linear-to-br from-red-50 to-red-100 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              <svg
                className="w-16 h-16 text-red-600 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h1 className="text-2xl font-bold text-gray-900">
                Error Loading Data
              </h1>
              <p className="text-gray-600 mt-2">{error || "Unknown error"}</p>
            </div>
            <Link
              href="/signup"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Try Sign Up Again
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <nav className="flex items-center justify-between mb-8">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            MR BEAST CHALLENGE
          </Link>
        </nav>

        {/* Success Message */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <div className="inline-block bg-green-100 rounded-full p-4 mb-4">
              <svg
                className="w-12 h-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ✅ Registration Successful!
            </h1>
            <p className="text-gray-600 text-lg">
              Welcome to MR BEAST CHALLENGE
            </p>
          </div>

          {/* User Info Box */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Your Entry Details
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium text-gray-900">{user.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium text-gray-900">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Entry Fee:</span>
                <span className="font-medium text-gray-900">$0.99</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-mono text-sm text-gray-900">
                  {transactionId}
                </span>
              </div>
            </div>
          </div>

          {/* Verification Status */}
          <div className="bg-blue-50 rounded-lg p-6 mb-6 border border-blue-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              📧 Email Verification Status
            </h2>

            {user.verified ? (
              <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-600">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <h3 className="font-semibold text-green-900">
                    Email Verified ✓
                  </h3>
                </div>
                <p className="text-green-700 text-sm mt-2">
                  Your email has been successfully verified. Redirecting to
                  payment...
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-600">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-6 h-6 text-yellow-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <h3 className="font-semibold text-yellow-900">
                      ⏳ Pending Verification
                    </h3>
                  </div>
                  <p className="text-yellow-700 text-sm mt-2">
                    Check your email for the verification link. The link expires
                    in {timeLeft}.
                  </p>
                </div>

                {/* Resend Email Section */}
                <div>
                  {resendMessage && (
                    <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm mb-4">
                      {resendMessage}
                    </div>
                  )}
                  {resendError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
                      {resendError}
                    </div>
                  )}
                  <button
                    onClick={handleResendEmail}
                    disabled={resendLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    {resendLoading
                      ? "Resending..."
                      : "Resend Verification Email"}
                  </button>
                </div>

                {/* Instructions */}
                <div className="bg-gray-50 rounded-lg p-4 text-gray-700 text-sm space-y-2">
                  <p className="font-semibold">What to do next:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>
                      Check your email inbox for "Welcome to MR BEAST CHALLENGE"
                    </li>
                    <li>
                      Click the "Verify Email Address" button in the email
                    </li>
                    <li>
                      Return here or you'll be automatically redirected to
                      payment
                    </li>
                    <li>Complete your $0.99 payment to confirm entry</li>
                  </ol>
                </div>
              </div>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium rounded-lg transition-colors"
            >
              Back to Home
            </Link>
            {user.verified && (
              <button
                onClick={() => router.push("/payment")}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Continue to Payment
              </button>
            )}
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-3">
            Not receiving the email?
          </h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>✓ Check your spam/junk folder</li>
            <li>✓ Make sure you entered the correct email address</li>
            <li>✓ Click "Resend Verification Email" above to try again</li>
            <li>
              ✓ Contact support at{" "}
              <span className="text-blue-600">support@mrbestchallenge.com</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}

export default function SignupConfirmPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <p>Loading...</p>
        </div>
      }
    >
      <ConfirmContent />
    </Suspense>
  );
}
