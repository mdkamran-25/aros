export default function HowItWorksSection() {
  const steps = [
    "Enter your name and email",
    "Pay $0.99 to join MR BEAST CHALLENGE",
    "Get instant confirmation",
    "Receive competition details",
    "Compete and WIN BIG",
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center">
          ⚡ How MR BEAST CHALLENGE Works
        </h2>
        <div className="space-y-6">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                {idx + 1}
              </div>
              <p className="text-lg text-gray-700 pt-2">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
