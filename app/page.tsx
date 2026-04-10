import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import BenefitsSection from "./components/BenefitsSection";
import HowItWorksSection from "./components/HowItWorksSection";
import PaymentSection from "./components/PaymentSection";
import UrgencySection from "./components/UrgencySection";
import FinalCtaSection from "./components/FinalCtaSection";
import EntryForm from "./components/EntryForm";

export default function Home() {
  return (
    <main className="bg-white">
      <HeroSection />
      <AboutSection />
      <BenefitsSection />
      <HowItWorksSection />

      {/* Entry Form Section */}
      <section id="entry-form" className="py-20 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
            Ready to Enter?
          </h2>
          <EntryForm />
        </div>
      </section>

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
