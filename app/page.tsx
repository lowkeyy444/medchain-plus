import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#062f2f] via-[#0a3f3a] to-[#021e1c] flex items-center justify-center p-10">

      {/* Floating Main Card */}
      <div className="bg-[#f7f7f7] w-full max-w-7xl rounded-[32px] shadow-[0_30px_80px_rgba(0,0,0,0.35)] overflow-hidden">

        {/* NAVBAR */}
        <nav className="flex items-center justify-between px-14 py-8">
          <h1 className="text-2xl font-serif font-semibold">
            MedChain+
          </h1>

          <div className="hidden md:flex gap-10 text-gray-600 text-sm">
            <a href="#" className="hover:text-gray-900 transition">Home</a>
            <a href="#" className="hover:text-gray-900 transition">About</a>
            <a href="#" className="hover:text-gray-900 transition">Security</a>
            <a href="#" className="hover:text-gray-900 transition">Support</a>
          </div>

          <Link
            href="/login"
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-7 py-3 rounded-xl shadow-md hover:shadow-lg hover:from-emerald-600 hover:to-emerald-700 transition"
          >
            Doctor Login
          </Link>
        </nav>

        {/* HERO SECTION */}
        <section className="grid md:grid-cols-2 gap-16 px-14 pb-24 items-center">

          {/* LEFT COLUMN */}
          <div>
            <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-medium px-4 py-2 rounded-full mb-8">
              Secure Biometric Infrastructure
            </span>

            <h2 className="text-5xl font-serif font-semibold leading-[1.1] mb-8">
              Transform Hospital Record Management with Biometric Identity
            </h2>

            <p className="text-gray-600 text-lg leading-relaxed mb-10 max-w-xl">
              MedChain+ enables structured, secure, and hospital-scale
              management of patient medical records through biometric
              verification, relational architecture, and transparent
              audit logging.
            </p>

            <Link
              href="/login"
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-4 rounded-xl shadow-md hover:shadow-lg hover:from-emerald-600 hover:to-emerald-700 transition"
            >
              Access Doctor Portal
            </Link>
          </div>

          {/* RIGHT COLUMN */}
          <div className="relative">
            <div className="bg-emerald-500 rounded-[28px] h-[460px] overflow-hidden flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3"
                alt="Healthcare professionals"
                className="object-cover h-full w-full"
              />
            </div>
          </div>

        </section>

        {/* TRUST STRIP */}
        <section className="bg-[#e9eff1] py-12 px-14 text-center">
          <p className="text-gray-600 mb-6">
            Designed for hospital-scale medical infrastructure
          </p>

          <div className="flex justify-center gap-16 text-gray-400 text-sm">
            <span>Regional Hospitals</span>
            <span>Emergency Units</span>
            <span>Specialty Clinics</span>
            <span>Research Institutions</span>
          </div>
        </section>

      </div>

    </main>
  );
}