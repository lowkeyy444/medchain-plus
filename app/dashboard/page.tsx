"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, []);

  return (
    <div className="min-h-screen flex">

      {/* Sidebar */}
      <aside className="w-64 bg-[#062f2f] text-white p-8 flex flex-col">
        <h1 className="text-2xl font-semibold mb-12">
          MedChain+
        </h1>

        <nav className="flex flex-col gap-6 text-sm">
          <Link href="/dashboard" className="hover:text-emerald-300">
            Dashboard
          </Link>
          <Link href="/dashboard/register-patient" className="hover:text-emerald-300">
            Register Patient
          </Link>
          <Link href="/dashboard/search" className="hover:text-emerald-300">
            Biometric Search
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-12">

        <h1 className="text-3xl font-semibold text-gray-900 mb-10">
          Doctor Dashboard
        </h1>

        <div className="grid md:grid-cols-2 gap-8">

          {/* Register Patient Card */}
          <Link
            href="/dashboard/register-patient"
            className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition border border-gray-200"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Register New Patient
            </h2>
            <p className="text-gray-600 text-sm">
              Enroll patient using biometric identity token generation.
            </p>
          </Link>

          {/* Biometric Search Card */}
          <Link
            href="/dashboard/search"
            className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition border border-gray-200"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Biometric Search
            </h2>
            <p className="text-gray-600 text-sm">
              Retrieve patient securely using biometric token.
            </p>
          </Link>

        </div>

      </main>
    </div>
  );
}