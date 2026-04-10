"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("tid");
  const email = searchParams.get("email");
  const name = searchParams.get("name");

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

      {/* Success Content */}
      <main className="max-w-2xl mx-auto px-4 md:px-8 py-12 md:py-20">
        {/* Success Icon and Header */}
        <div className="text-center mb-12">
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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            ✓ Welcome to the Challenge!
          </h1>
          <p className="text-xl text-gray-600">
            Your entry has been confirmed. Check your email for next steps.
          </p>
        </div>

        {/* Confirmation Card */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Entry Details
          </h2>

          <div className="space-y-4 mb-8">
            {name && (
              <div className="flex justify-between items-start pb-4 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Name</span>
                <span className="text-right text-gray-900 font-semibold">
                  {decodeURIComponent(name)}
                </span>
              </div>
            )}
            {email && (
              <div className="flex justify-between items-start pb-4 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Email</span>
                <span className="text-right text-gray-900 font-semibold text-sm md:text-base break-all">
                  {decodeURIComponent(email)}
                </span>
              </div>
            )}
            {transactionId && (
              <div className="flex justify-between items-start pb-4 border-b border-gray-200">
                <span className="text-gray-600 font-medium">
                  Transaction ID
                </span>
                <span className="text-right text-gray-900 font-mono text-sm md:text-base">
                  {transactionId}
                </span>
              </div>
            )}
            <div className="flex justify-between items-start">
              <span className="text-gray-600 font-medium">Email Verified</span>
              <span className="text-right text-yellow-600 font-semibold">
                ⏳ Pending (Check your email)
              </span>
            </div>
          </div>

          {/* Copy Transaction ID Button */}
          {transactionId && (
            <button
              onClick={() => {
                navigator.clipboard.writeText(transactionId);
                alert("Transaction ID copied to clipboard!");
              }}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-2 px-4 rounded-lg transition-colors mb-6"
            >
              Copy Transaction ID
            </button>
          )}
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 mb-12">
          <h2 className="text-xl font-bold text-blue-900 mb-6">
            ✅ Your Entry is Complete!
          </h2>
          <ol className="space-y-4 text-blue-900">
            <li className="flex gap-4">
              <span className="font-bold shrink-0">✓</span>
              <span>Email verified successfully</span>
            </li>
            <li className="flex gap-4">
              <span className="font-bold shrink-0">✓</span>
              <span>Payment of $0.99 processed</span>
            </li>
            <li className="flex gap-4">
              <span className="font-bold shrink-0">✓</span>
              <span>Entry fee paid and confirmed</span>
            </li>
            <li className="flex gap-4">
              <span className="font-bold shrink-0">→</span>
              <span>
                Check your email for official competition rules and next steps
              </span>
            </li>
          </ol>
        </div>

        {/* Support Section */}
        <div className="mt-16 text-center text-gray-600">
          <p className="mb-4">Having trouble?</p>
          <a
            href="mailto:support@mrbeastchallenge.com"
            className="text-blue-600 hover:underline font-medium"
          >
            Contact Support
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 p-8 text-center text-gray-600 text-sm">
        <p>&copy; 2024 MR BEAST CHALLENGE. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
