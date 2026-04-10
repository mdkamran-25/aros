export default function HeroSection() {
  return (
    <section
      className="min-h-screen text-white flex items-center justify-center px-4 py-16 md:py-20 relative bg-cover bg-center"
      style={{
        backgroundImage: "url(/img/image1.png)",
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
      }}
    >
      {/* Overlay for text readability - darker on mobile */}
      <div className="absolute inset-0 bg-black/60 md:bg-black/40"></div>

      <div className="max-w-2xl mx-auto text-center relative z-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
          💰 WIN BIG WITH MR BEAST CHALLENGE
        </h1>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 leading-relaxed">
          Welcome to the MR BEAST CHALLENGE — your chance to enter our viral
          YouTube competition and compete for HUGE cash prizes.
        </p>
        <a
          href="#entry-form"
          className="inline-block bg-white text-blue-600 font-bold text-base md:text-lg py-3 md:py-4 px-6 md:px-8 rounded-lg hover:bg-gray-100 transition-all mb-4 md:mb-6"
        >
          👉 Join MR BEAST CHALLENGE for $0.99
        </a>
        <p className="text-xs md:text-sm text-blue-100 px-2">
          No PayPal account needed. Pay with your debit or credit card.
        </p>
      </div>
    </section>
  );
}
