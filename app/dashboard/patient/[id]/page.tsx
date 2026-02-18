"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function PatientProfile() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [patient, setPatient] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [visitType, setVisitType] = useState("");
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [vitals, setVitals] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");
  const [investigations, setInvestigations] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    loadPatient();
  }, [id]);

  async function loadPatient() {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const res = await fetch(`/api/patients/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to load patient");
      return;
    }

    setPatient(data);
    setRecords(data.medicalRecords || []);
  }

  async function handleCreateRecord(e: React.FormEvent) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const res = await fetch("/api/medical-records", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        patientId: patient.id,
        visitType,
        chiefComplaint,
        vitals,
        diagnosis,
        prescription,
        investigations,
        followUpDate,
        notes,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      // Safe state update
      setRecords((prev) => [data, ...prev]);
      setShowForm(false);

      // Reset form
      setVisitType("");
      setChiefComplaint("");
      setVitals("");
      setDiagnosis("");
      setPrescription("");
      setInvestigations("");
      setFollowUpDate("");
      setNotes("");
    } else {
      alert(data.error);
    }
  }

  async function handleFileUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    recordId: number
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("medicalRecordId", String(recordId));

    const res = await fetch("/api/attachments/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      setRecords((prev) =>
        prev.map((r) =>
          r.id === recordId
            ? { ...r, attachments: [...(r.attachments || []), data] }
            : r
        )
      );
    } else {
      alert(data.error);
    }
  }

  async function handleViewFile(filePath: string) {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/attachments/view", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ filePath }),
    });

    const data = await res.json();

    if (res.ok) {
      window.open(data.url, "_blank");
    } else {
      alert(data.error);
    }
  }

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
        <h1 className="text-2xl font-semibold mb-12">MedChain+</h1>
        <nav className="flex flex-col gap-6 text-sm">
          <Link href="/dashboard" className="hover:text-emerald-300">
            Dashboard
          </Link>
          <Link href="/dashboard/search" className="hover:text-emerald-300">
            Biometric Search
          </Link>
        </nav>
      </aside>

      <main className="flex-1 bg-gray-100 p-12 space-y-8">

        {/* Patient Header */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
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
              onClick={() => setExpanded((prev) => !prev)}
              className="text-emerald-600 text-sm font-medium hover:underline"
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
              </div>
            </div>
          )}
        </div>

        {/* Medical Records */}
        <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200">

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Medical Records
            </h2>
            <button
              onClick={() => setShowForm((prev) => !prev)}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-700 transition"
            >
              + Add Record
            </button>
          </div>

          {/* Add Record Form */}
          {showForm && (
            <form
              onSubmit={handleCreateRecord}
              className="mb-6 space-y-4 border border-gray-200 p-6 rounded-xl bg-gray-50"
            >
              <select
                value={visitType}
                onChange={(e) => setVisitType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900"
              >
                <option value="">Select Visit Type</option>
                <option value="OPD">OPD</option>
                <option value="Emergency">Emergency</option>
                <option value="Follow-up">Follow-up</option>
              </select>

              <input type="text" placeholder="Chief Complaint"
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900"
              />

              <input type="text" placeholder="Vitals"
                value={vitals}
                onChange={(e) => setVitals(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900"
              />

              <input type="text" placeholder="Diagnosis" required
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900"
              />

              <input type="text" placeholder="Prescription"
                value={prescription}
                onChange={(e) => setPrescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900"
              />

              <input type="text" placeholder="Investigations"
                value={investigations}
                onChange={(e) => setInvestigations(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900"
              />

              <input type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900"
              />

              <textarea placeholder="Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900"
              />

              <button
                type="submit"
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
              >
                Save Record
              </button>
            </form>
          )}

          {/* Records List */}
          {records.map((record) => (
            <div
              key={record.id}
              className="border border-gray-200 rounded-xl p-6 bg-gray-50 space-y-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    🏥 {record.doctor?.hospital?.name || "Unknown Hospital"}
                  </p>
                  <p className="text-xs text-gray-600">
                    👨‍⚕️ Dr. {record.doctor?.name || "Unknown Doctor"}
                  </p>
                </div>
                <p className="text-xs text-gray-500">
                  {new Date(record.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="space-y-1 text-sm text-gray-800">
                {record.visitType && <p><strong>Visit Type:</strong> {record.visitType}</p>}
                {record.chiefComplaint && <p><strong>Chief Complaint:</strong> {record.chiefComplaint}</p>}
                {record.vitals && <p><strong>Vitals:</strong> {record.vitals}</p>}
                <p><strong>Diagnosis:</strong> {record.diagnosis}</p>
                {record.prescription && <p><strong>Prescription:</strong> {record.prescription}</p>}
                {record.investigations && <p><strong>Investigations:</strong> {record.investigations}</p>}
                {record.followUpDate && (
                  <p><strong>Follow-up:</strong> {new Date(record.followUpDate).toLocaleDateString()}</p>
                )}
                {record.notes && <p><strong>Notes:</strong> {record.notes}</p>}
              </div>

              {/* Attachments */}
              <div className="pt-3 border-t border-gray-200 space-y-2">
                <p className="text-xs font-semibold text-gray-700">Attachments</p>

                <div className="flex items-center gap-3">
                  <label className="cursor-pointer bg-emerald-600 text-white px-3 py-1.5 rounded-md text-xs hover:bg-emerald-700 transition">
                    Upload File
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, record.id)}
                    />
                  </label>
                  <span className="text-xs text-gray-500">
                    Attach lab reports, scans, PDFs
                  </span>
                </div>

                {record.attachments?.length > 0 && (
                  <div className="space-y-1">
                    {record.attachments.map((file: any) => (
                      <div key={file.id} className="flex justify-between text-xs">
                        <span className="text-gray-600">📎 {file.fileName}</span>
                        <button
                          onClick={() => handleViewFile(file.filePath)}
                          className="text-emerald-600 hover:underline"
                        >
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

        </div>

      </main>
    </div>
  );
}