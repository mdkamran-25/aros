import EntryForm from "../components/EntryForm";

export const metadata = {
  title: "Sign Up - MR BEAST CHALLENGE",
  description:
    "Sign up for the MR BEAST CHALLENGE and compete for amazing prizes!",
};

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 to-blue-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            💰 Join MR BEAST CHALLENGE
          </h1>
          <p className="text-lg text-gray-600">
            Enter the competition for just{" "}
            <span className="font-bold text-blue-600">$0.99</span>
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Get Started
            </h2>
            <p className="text-gray-600">
              Fill out the form below to sign up and start competing.
            </p>
          </div>

          <EntryForm />

          {/* Trust Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-500 mb-4">
              ✓ Secure payment processing
            </p>
            <p className="text-center text-xs text-gray-400">
              Your information is safe and secure. We respect your privacy.
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <a href="/" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Back to Home
          </a>
        </div>
      </div>
    </main>
  );
}
