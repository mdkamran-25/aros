export default function PaymentSection() {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-4xl font-bold mb-8 text-center">
          🔒 Secure Entry for MR BEAST CHALLENGE
        </h2>
        <p className="text-lg text-gray-700 text-center mb-8">
          All payments for MR BEAST CHALLENGE are securely processed via PayPal.
        </p>
        <div className="bg-white p-8 rounded-lg shadow-md space-y-4">
          <div className="flex items-center gap-3 py-3 border-b">
            <span className="text-2xl">✔</span>
            <p className="text-lg text-gray-700">Pay with PayPal</p>
          </div>
          <div className="flex items-center gap-3 py-3 border-b">
            <span className="text-2xl">✔</span>
            <p className="text-lg text-gray-700">
              Or pay with debit/credit card
            </p>
          </div>
          <div className="flex items-center gap-3 py-3">
            <span className="text-2xl">✔</span>
            <p className="text-lg text-gray-700">No PayPal account required</p>
          </div>
        </div>
      </div>
    </section>
  );
}
