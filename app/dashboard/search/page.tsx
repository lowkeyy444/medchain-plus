"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { QRCodeCanvas } from "qrcode.react";

export default function SearchPage() {
  const [tokenInput, setTokenInput] = useState("");
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const router = useRouter();

  // 🔍 TOKEN SEARCH (unchanged)
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

  // 🔵 STEP 1 — Generate QR Session
  async function handleGenerateQR() {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/biometric/auth/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        doctorId: 1, // replace later
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    setSessionId(data.sessionId);

    const qr =
      window.location.origin +
      "/biometric/auth?session=" +
      data.sessionId;

    setQrUrl(qr);
  }

  // 🔥 POLLING LOGIC (THIS WAS MISSING)
  useEffect(() => {
    if (!sessionId) return;

    console.log("🟢 Starting session polling...");

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/access-session/status?session=${sessionId}`
        );

        const data = await res.json();

        console.log("🔎 Session status:", data);

        if (data.status === "approved" && data.patientId) {
          console.log("✅ Session approved, redirecting...");
          clearInterval(interval);
          router.push(`/dashboard/patient/${data.patientId}`);
        }

        if (data.status === "rejected" || data.status === "expired") {
          clearInterval(interval);
          alert("Session expired or rejected.");
        }

      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 2000); // every 2 seconds

    return () => clearInterval(interval);
  }, [sessionId, router]);

  return (
    <div className="min-h-screen flex">

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

      <main className="flex-1 bg-gray-100 p-12">
        <h1 className="text-3xl font-semibold text-gray-900 mb-10">
          Patient Access
        </h1>

        {/* TOKEN SEARCH */}
        <div className="bg-white p-10 rounded-2xl shadow-md border border-gray-200 max-w-xl space-y-6">
          <h2 className="text-xl font-semibold">Search by Biometric Token</h2>

          <form onSubmit={handleSearch} className="space-y-6">
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
        </div>

        <div className="my-10 text-center text-gray-500 font-medium">
          OR
        </div>

        {/* QR LOGIN */}
        <div className="bg-white p-10 rounded-2xl shadow-md border border-gray-200 max-w-xl text-center space-y-6">
          <h2 className="text-xl font-semibold">Authenticate via QR</h2>

          <button
            onClick={handleGenerateQR}
            className="w-full bg-blue-600 text-white py-4 rounded-lg
            hover:bg-blue-700 transition font-medium"
          >
            Generate QR for Patient Login
          </button>

          {qrUrl && (
            <div className="mt-6 space-y-4">
              <QRCodeCanvas value={qrUrl} size={220} />
              <p className="text-sm text-gray-500">
                Patient scans this QR to authenticate via biometric
              </p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}