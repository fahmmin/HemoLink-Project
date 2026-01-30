import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div className="max-w-3xl mx-auto text-center">
      <h1 className="text-4xl md:text-6xl font-bold border-4 border-black inline-block px-6 py-3 bg-[#4ECDC4] shadow-[6px_6px_0_0_#000] mb-4">
        HemoLink
      </h1>
      <p className="text-xl font-medium mb-6">
        Connect with blood donors nearby. Emergency SOS, eligibility scores, and transparent AI reasons.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          to="/request"
          className="font-bold text-lg border-4 border-black px-6 py-3 bg-[#FF6B6B] text-white no-underline shadow-[5px_5px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[4px_4px_0_0_#000]"
        >
          I need blood – SOS
        </Link>
        <Link
          to="/donor"
          className="font-bold text-lg border-4 border-black px-6 py-3 bg-[#95E1A3] text-black no-underline shadow-[5px_5px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5"
        >
          I want to donate
        </Link>
      </div>
      <p className="mt-8 text-sm text-black/70">
        Find compatible donors by blood group and location. No cloud APIs – distance computed locally.
      </p>
    </div>
  );
}
