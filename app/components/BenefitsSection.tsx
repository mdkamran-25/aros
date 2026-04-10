import Image from "next/image";

export default function BenefitsSection() {
  const benefits = [
    {
      title: "Chance to win BIG cash prizes",
      description:
        "Compete in our viral YouTube competition for life-changing rewards. The more participants, the bigger the prize pool grows. Your $0.99 entry could turn into thousands in cash prizes.",
      image: "/img/image1.png",
    },
    {
      title: "Be featured in MR BEAST CHALLENGE videos",
      description:
        "Selected winners and top performers will be featured in official MR BEAST CHALLENGE YouTube videos. Get exposed to millions of viewers worldwide and build your own fanbase.",
      image: "/img/images2.jpeg",
    },
    {
      title: "Compete with participants worldwide",
      description:
        "Join a global community of millions competing in real-time challenges. Test your skills against the best participants from every corner of the world and climb the leaderboards.",
      image: "/img/images3.jpeg",
    },
    {
      title: "Entry costs less than $1",
      description:
        "Join the challenge for just $0.99 — the lowest barrier to entry for the highest rewards. No hidden fees, no PayPal account required. Pay with any debit or credit card instantly.",
      image: "/img/images4.jpeg",
    },
  ];

  return (
    <section className="py-12 md:py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-4xl text-black font-bold mb-8 md:mb-12 text-center">
          Why Join MR BEAST CHALLENGE?
        </h2>
        <div className="space-y-6 md:space-y-8">
          {benefits.map((benefit, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col md:flex-row items-center"
            >
              {/* Image - responsive size */}
              <div className="w-full md:w-64 h-48 md:h-64 relative shrink-0">
                <Image
                  src={benefit.image}
                  alt={benefit.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 256px"
                  className="object-cover"
                />
              </div>

              {/* Description on the right */}
              <div className="flex-1 p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2 md:mb-3">
                  {benefit.title}
                </h3>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
