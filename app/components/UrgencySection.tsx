export default function UrgencySection() {
  return (
    <section className="py-20 px-4 bg-red-50 border-t-4 border-red-500">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-4xl font-bold mb-8 text-center text-red-600">
          ⏳ Limited Spots for MR BEAST CHALLENGE
        </h2>
        <div className="space-y-6 text-lg text-gray-700">
          <p>
            MR BEAST CHALLENGE is only accepting a limited number of
            participants.
          </p>
          <p className="font-semibold text-xl">
            Once all spots are filled, registration will close.
          </p>
          <p>Don't miss your chance to be part of MR BEAST CHALLENGE.</p>
        </div>
      </div>
    </section>
  );
}
