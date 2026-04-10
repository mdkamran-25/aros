"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setError("No verification token provided");
      return;
    }

    // Call verify API
    fetch(`/api/verify?token=${token}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setStatus("success");
          setData(result.data);
          // Redirect to payment page after 2 seconds
          setTimeout(() => {
            router.push("/payment");
          }, 2000);
        } else {
          setStatus("error");
          setError(result.error || "Verification failed");
        }
      })
      .catch((err) => {
        setStatus("error");
        setError("An error occurred during verification");
        console.error(err);
      });
  }, [token, router]);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-4 md:p-8 border-b border-gray-200">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          MR BEAST CHALLENGE
        </Link>
        <Link
          href="/"
          className="text-gray-600 hover:text-gray-900 font-medium"
        >
          Back Home
        </Link>
      </nav>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 md:px-8 py-12 md:py-20">
        {status === "loading" && (
          <div className="text-center">
            <div className="inline-block animate-spin">
              <svg
                className="w-16 h-16 text-blue-600"
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
            <h1 className="text-2xl font-bold text-gray-900 mt-6 mb-2">
              Verifying Your Email...
            </h1>
            <p className="text-gray-600">
              Please wait while we verify your email address.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="text-center">
            <div className="inline-block bg-green-100 rounded-full p-4 mb-6">
              <svg
                className="w-16 h-16 text-green-600"
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              ✓ Email Verified!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Your email address has been successfully verified.
            </p>

            {data && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 mb-8 text-left">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Entry Details
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between border-b border-gray-200 pb-3">
                    <span className="text-gray-600">Name</span>
                    <span className="text-gray-900 font-semibold">
                      {data.name}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-3">
                    <span className="text-gray-600">Email</span>
                    <span className="text-gray-900 font-semibold">
                      {data.email}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID</span>
                    <span className="text-gray-900 font-mono text-sm">
                      {data.transactionId}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-bold text-blue-900 mb-3">
                Redirecting to Payment...
              </h3>
              <p className="text-blue-900 mb-4">
                You will be redirected to the payment page in a moment. Click
                below if not redirected.
              </p>
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin">
                  <svg
                    className="w-5 h-5 text-blue-600"
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
                <span>Preparing payment page...</span>
              </div>
            </div>

            <Link
              href="/payment"
              className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition"
            >
              Continue to Payment
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="text-center">
            <div className="inline-block bg-red-100 rounded-full p-4 mb-6">
              <svg
                className="w-16 h-16 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Verification Failed
            </h1>
            <p className="text-xl text-gray-600 mb-8">{error}</p>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-bold text-red-900 mb-3">
                What Went Wrong?
              </h3>
              <ul className="text-red-900 text-left space-y-2 mb-4">
                <li>
                  • The verification link may have expired (valid for 24 hours)
                </li>
                <li>• The link may be invalid or corrupted</li>
                <li>• Your session may have timed out</li>
              </ul>
              <p className="text-red-900">
                Try signing up again to receive a new verification link.
              </p>
            </div>

            <Link
              href="/signup"
              className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition"
            >
              Sign Up Again
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
