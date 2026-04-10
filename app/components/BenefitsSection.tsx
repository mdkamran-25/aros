export default function BenefitsSection() {
  const benefits = [
    {
      emoji: "💰",
      title: "Chance to win BIG cash prizes",
    },
    {
      emoji: "🎥",
      title: "Be featured in MR BEAST CHALLENGE videos",
    },
    {
      emoji: "🌍",
      title: "Compete with participants worldwide",
    },
    {
      emoji: "💵",
      title: "Entry costs less than $1",
    },
  ];

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center">
          💥 Why Join MR BEAST CHALLENGE?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-5xl mb-4">{benefit.emoji}</div>
              <p className="text-xl font-semibold text-gray-800">
                {benefit.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
