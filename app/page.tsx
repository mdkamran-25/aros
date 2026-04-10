import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import BenefitsSection from "./components/BenefitsSection";
import HowItWorksSection from "./components/HowItWorksSection";
import PaymentSection from "./components/PaymentSection";
import UrgencySection from "./components/UrgencySection";
import FinalCtaSection from "./components/FinalCtaSection";

export default function Home() {
  return (
    <main className="bg-white">
      <HeroSection />
      <AboutSection />
      <BenefitsSection />
      <HowItWorksSection />
      <PaymentSection />
      <UrgencySection />
      <FinalCtaSection />

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <p className="mb-4">
            &copy; 2026 MR BEAST CHALLENGE. All rights reserved.
          </p>
          <div className="flex justify-center gap-6 text-sm">
            <a href="#" className="hover:text-white transition">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition">
              Terms of Service
            </a>
            <a href="#" className="hover:text-white transition">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
