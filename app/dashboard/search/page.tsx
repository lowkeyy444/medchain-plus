"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SearchPage() {
  const [tokenInput, setTokenInput] = useState("");
  const router = useRouter();

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const res = await fetch("/api/patients/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ biometricToken: tokenInput }),
    });

    const data = await res.json();

    if (res.ok) {
      router.push(`/dashboard/patient/${data.patientId}`);
    } else {
      alert(data.error);
    }
  }

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
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 bg-gray-100 p-12">
        <h1 className="text-3xl font-semibold text-gray-900 mb-10">
          Biometric Patient Search
        </h1>

        <form
          onSubmit={handleSearch}
          className="bg-white p-10 rounded-2xl shadow-md border border-gray-200 max-w-xl space-y-6"
        >
          <input
            type="text"
            placeholder="Enter Biometric Token"
            required
            className="w-full p-4 border border-gray-300 rounded-lg
            focus:ring-2 focus:ring-emerald-500
            placeholder:text-gray-500 text-gray-900"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-4 rounded-lg
            hover:bg-emerald-700 transition font-medium"
          >
            Search Patient
          </button>
        </form>
      </main>
    </div>
  );
}