"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSessionEmail, clearSession } from "@/lib/auth-client";

declare global {
  interface Window {
    paypal: any;
  }
}

export default function PaymentPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [paypalReady, setPaypalReady] = useState(false);
  const [paypalError, setPaypalError] = useState("");

  useEffect(() => {
    // Check if user is logged in by validating with server
    const checkAuth = async () => {
      try {
        // Try to fetch user profile - server will validate session cookie
        // If user_email cookie exists, server can check it
        const response = await fetch("/api/user-profile-check", {
          credentials: "include",
        });

        if (!response.ok) {
          // No valid session
          router.push("/login");
          return;
        }

        const userData = await response.json();
        setUser(userData.user);
        setLoading(false);

        // Load PayPal script if user is verified
        if (userData.user.verified) {
          loadPayPalScript();
        }
      } catch (err) {
        console.error(err);
        router.push("/login");
      }
    };

    const timer = setTimeout(checkAuth, 100); // Small delay to ensure cookies are set
    return () => clearTimeout(timer);
  }, [router]);

  // Load PayPal script
  const loadPayPalScript = () => {
    if (window.paypal) {
      setPaypalReady(true);
      renderPayPalButton();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD`;
    script.async = true;
    script.onload = () => {
      setPaypalReady(true);
      renderPayPalButton();
    };
    script.onerror = () => {
      setPaypalError("Failed to load PayPal. Please refresh the page.");
    };
    document.body.appendChild(script);
  };

  // Render PayPal button
  const renderPayPalButton = () => {
    if (!window.paypal) return;

    window.paypal
      .Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: "0.99",
                },
                description: "MR BEAST CHALLENGE Entry fee",
              },
            ],
          });
        },
        onApprove: async (data: any, actions: any) => {
          setProcessingPayment(true);
          try {
            // Capture the order
            const details = await actions.order.capture();

            // Mark payment as completed in database
            const response = await fetch("/api/payment-complete", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ email: user.email }),
            });

            if (!response.ok) {
              throw new Error("Failed to complete payment in database");
            }

            // Redirect to success page
            const params = new URLSearchParams({
              tid: user.transactionId || "",
              email: user.email || "",
              name: user.name || "",
            });
            router.push(`/success?${params.toString()}`);
          } catch (err) {
            console.error("Payment error:", err);
            setPaypalError(
              "Payment was successful but failed to save. Please contact support with your order ID.",
            );
            setProcessingPayment(false);
          }
        },
        onError: (err: any) => {
          console.error("PayPal error:", err);
          setPaypalError(
            "Payment failed. Please try again or use a different payment method.",
          );
          setProcessingPayment(false);
        },
      })
      .render("#paypal-button-container");
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
      clearSession();
      router.push("/");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin mb-4">
            <svg
              className="w-8 h-8 text-blue-600"
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
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
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
          <div className="flex gap-4">
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Logout
            </button>
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Exit
            </Link>
          </div>
        </nav>

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Complete Your Entry
          </h1>
          <p className="text-xl text-gray-600">
            Final step: Secure payment of $0.99
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Payment Details
              </h2>

              {/* User Info */}
              <div
                className={`rounded-lg p-4 mb-6 ${
                  user?.verified
                    ? "bg-green-50 border-l-4 border-green-600"
                    : "bg-yellow-50 border-l-4 border-yellow-600"
                }`}
              >
                <p className="text-gray-700">
                  <span className="font-semibold">Email:</span> {user?.email}
                </p>
                <p
                  className={`text-sm mt-2 font-semibold ${
                    user?.verified ? "text-green-700" : "text-yellow-700"
                  }`}
                >
                  {user?.verified ? (
                    <>✅ Email verified</>
                  ) : (
                    <>⏳ Email verification pending</>
                  )}
                </p>
                {!user?.verified && (
                  <p className="text-sm text-yellow-700 mt-2">
                    Please verify your email by clicking the link sent to your
                    inbox before proceeding with payment.
                  </p>
                )}
              </div>

              {/* Payment Info */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between pb-4 border-b border-gray-200">
                  <span className="text-gray-600">Entry Fee</span>
                  <span className="font-semibold text-gray-900">$0.99</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total</span>
                  <span className="text-2xl font-bold text-green-600">
                    $0.99
                  </span>
                </div>
              </div>

              {/* Payment Method - Only show if verified */}
              {user?.verified && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Payment Method
                  </h3>
                  <div className="bg-gray-50 border-2 border-blue-200 rounded-lg p-4">
                    <p className="text-gray-600 mb-2">💳 Credit/Debit Card</p>
                    <p className="text-sm text-gray-500">
                      Secure payment processing powered by industry-leading
                      payment gateways
                    </p>
                  </div>
                </div>
              )}

              {/* Terms - Only show if verified */}
              {user?.verified && (
                <div className="bg-gray-50 rounded-lg p-4 mb-8">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-3 text-sm text-gray-600">
                      I agree to the terms and conditions
                    </span>
                  </label>
                </div>
              )}

              {/* Verification Pending Message */}
              {!user?.verified && (
                <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 mb-8 rounded">
                  <h3 className="font-bold text-yellow-900 mb-2">
                    ⏳ Email Verification Required
                  </h3>
                  <p className="text-yellow-800 mb-4">
                    Before you can complete your payment, please verify your
                    email address. Check your inbox for the verification link.
                  </p>
                  <button
                    onClick={async () => {
                      if (!user?.email) return;
                      setResendLoading(true);
                      setResendMessage("");
                      try {
                        const response = await fetch(
                          "/api/resend-verification",
                          {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            credentials: "include",
                            body: JSON.stringify({ email: user.email }),
                          },
                        );

                        if (response.ok) {
                          setResendMessage(
                            "Verification email resent! Check your inbox.",
                          );
                        } else {
                          const data = await response.json();
                          setResendMessage(
                            data.error || "Failed to resend. Try again later.",
                          );
                        }
                      } catch (err) {
                        setResendMessage("An error occurred. Try again.");
                      } finally {
                        setResendLoading(false);
                      }
                    }}
                    disabled={resendLoading}
                    className="bg-yellow-600 text-white font-semibold px-4 py-2 rounded hover:bg-yellow-700 transition disabled:opacity-50"
                  >
                    {resendLoading
                      ? "Resending..."
                      : "Resend Verification Email"}
                  </button>
                  {resendMessage && (
                    <p
                      className={`text-sm mt-2 ${
                        resendMessage.includes("resent")
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {resendMessage}
                    </p>
                  )}
                </div>
              )}

              {/* Payment Button - PayPal if verified */}
              {user?.verified && (
                <>
                  {paypalError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                      {paypalError}
                    </div>
                  )}
                  <div
                    id="paypal-button-container"
                    className="mb-4"
                    style={{
                      opacity: paypalReady && processingPayment ? 0.5 : 1,
                      pointerEvents: processingPayment ? "none" : "auto",
                    }}
                  />
                  {!paypalReady && (
                    <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 text-center">
                      <div className="inline-block animate-spin mb-2">
                        <svg
                          className="w-6 h-6 text-blue-600"
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
                      <p className="text-gray-600">Loading PayPal...</p>
                    </div>
                  )}
                </>
              )}
              {/* Show message if not verified */}
              {!user?.verified && (
                <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 text-center">
                  <p className="text-gray-600">
                    Verify your email to complete payment
                  </p>
                </div>
              )}

              <p className="text-center text-xs text-gray-500 mt-4">
                🔒 Your payment is secure and encrypted
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Order Summary
              </h3>

              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    MR BEAST CHALLENGE Entry
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Complete entry with competition access
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">$0.99</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600">Fees</span>
                  <span className="font-semibold">$0.00</span>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-green-600 text-lg">
                    $0.99
                  </span>
                </div>
              </div>

              <div className="mt-6 bg-green-50 rounded-lg p-4">
                <p className="text-sm text-green-900">
                  ✓ Your entry fee includes full competition access and official
                  participant status.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-2">Need help?</p>
          <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
            Contact support@mrbestchallenge.com
          </a>
        </div>
      </div>
    </main>
  );
}
