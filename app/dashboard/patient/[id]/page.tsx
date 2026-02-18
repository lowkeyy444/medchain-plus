"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function PatientProfile() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [patient, setPatient] = useState<any>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch(`/api/patients/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          alert(data.error || "Failed to load patient");
          return;
        }
        setPatient(data);
      });
  }, [id]);

  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const age = patient.dateOfBirth
    ? new Date().getFullYear() -
      new Date(patient.dateOfBirth).getFullYear()
    : null;

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
          <Link href="/dashboard/search" className="hover:text-emerald-300">
            Biometric Search
          </Link>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 bg-gray-100 p-12 space-y-8">

        {/* Compact Patient Header */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 transition-all">

          <div className="flex justify-between items-center">

            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {patient.name}
              </h1>

              <p className="text-gray-600 text-sm mt-1">
                {age ? `${age} yrs` : "—"} • {patient.gender || "—"}
              </p>

              <p className="text-gray-500 text-sm mt-1">
                {patient.phone || "—"}
              </p>
            </div>

            <button
              onClick={() => setExpanded(!expanded)}
              className="text-emerald-600 text-sm font-medium"
            >
              {expanded ? "Hide Details" : "View Details"}
            </button>

          </div>

          {expanded && (
            <div className="mt-6 grid md:grid-cols-2 gap-6 text-sm text-gray-700">

              <div>
                <p><strong>Email:</strong> {patient.email || "—"}</p>
                <p><strong>Address:</strong> {patient.address || "—"}</p>
                <p><strong>Blood Group:</strong> {patient.bloodGroup || "—"}</p>
              </div>

              <div>
                <p><strong>Allergies:</strong> {patient.allergies || "—"}</p>
                <p><strong>Medications:</strong> {patient.currentMedications || "—"}</p>
                <p><strong>Emergency:</strong> {patient.emergencyContactName || "—"} ({patient.emergencyContactPhone || "—"})</p>
                <p><strong>Registered By:</strong> {patient.registeredBy?.name || "—"}</p>
              </div>

            </div>
          )}
        </div>

        {/* Medical Records Section */}
        <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200">

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Medical Records
            </h2>

            <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-700 transition">
              + Add Record
            </button>
          </div>

          <div className="text-gray-500 text-sm">
            No medical records yet.
          </div>

        </div>

      </main>
    </div>
  );
}