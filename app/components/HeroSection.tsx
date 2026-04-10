export default function HeroSection() {
  return (
    <section
      className="min-h-screen text-white flex items-center justify-center px-4 py-20 relative bg-cover bg-center"
      style={{
        backgroundImage: "url(/img/image1.png)",
      }}
    >
      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="max-w-2xl mx-auto text-center relative z-10">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          WIN BIG WITH MR BEAST CHALLENGE
        </h1>
        <p className="text-xl md:text-2xl mb-8 leading-relaxed">
          Welcome to the MR BEAST CHALLENGE — your chance to enter our viral
          YouTube competition and compete for HUGE cash prizes.
        </p>
        <a
          href="#entry-form"
          className="inline-block bg-white text-blue-600 font-bold text-lg py-4 px-8 rounded-lg hover:bg-gray-100 transition-all mb-6"
        >
          Pay $0.99 & Join Now
        </a>
        <p className="text-sm text-blue-100">
          No PayPal account needed. Pay with your debit or credit card.
        </p>
      </div>
    </section>
  );
}
