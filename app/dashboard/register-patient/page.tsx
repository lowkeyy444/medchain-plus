"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPatient() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    bloodGroup: "",
    allergies: "",
    currentMedications: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
  });

  const [biometricToken, setBiometricToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const res = await fetch("/api/patients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      setBiometricToken(data.biometricToken);
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
          <Link href="/dashboard/register-patient" className="text-emerald-300">
            Register Patient
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-12">

        <h1 className="text-3xl font-semibold text-gray-900 mb-10">
          Register Patient
        </h1>

        {!biometricToken ? (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-10 rounded-2xl shadow-md border border-gray-200 max-w-3xl space-y-10"
          >

            {/* Identity Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Identity Information
              </h2>

              <div className="grid gap-6">

                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  className="p-4 border border-gray-300 rounded-lg
                  focus:ring-2 focus:ring-emerald-500
                  placeholder:text-gray-500 text-gray-900"
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />

                <div className="grid grid-cols-2 gap-6">
                  <input
                    type="date"
                    className="p-4 border border-gray-300 rounded-lg
                    focus:ring-2 focus:ring-emerald-500 text-gray-900"
                    onChange={(e) =>
                      setForm({ ...form, dateOfBirth: e.target.value })
                    }
                  />

                  <select
                    className="p-4 border border-gray-300 rounded-lg
                    focus:ring-2 focus:ring-emerald-500 text-gray-900"
                    onChange={(e) =>
                      setForm({ ...form, gender: e.target.value })
                    }
                  >
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <input
                    type="text"
                    placeholder="Phone Number"
                    required
                    className="p-4 border border-gray-300 rounded-lg
                    focus:ring-2 focus:ring-emerald-500
                    placeholder:text-gray-500 text-gray-900"
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />

                  <input
                    type="email"
                    placeholder="Email Address"
                    className="p-4 border border-gray-300 rounded-lg
                    focus:ring-2 focus:ring-emerald-500
                    placeholder:text-gray-500 text-gray-900"
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                </div>

                <textarea
                  placeholder="Address"
                  rows={3}
                  className="p-4 border border-gray-300 rounded-lg
                  focus:ring-2 focus:ring-emerald-500
                  placeholder:text-gray-500 text-gray-900"
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                />

              </div>
            </div>

            {/* Medical Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Medical Information
              </h2>

              <div className="grid gap-6">
                <input
                  type="text"
                  placeholder="Blood Group"
                  className="p-4 border border-gray-300 rounded-lg
                  focus:ring-2 focus:ring-emerald-500
                  placeholder:text-gray-500 text-gray-900"
                  onChange={(e) =>
                    setForm({ ...form, bloodGroup: e.target.value })
                  }
                />

                <textarea
                  placeholder="Known Allergies"
                  rows={3}
                  className="p-4 border border-gray-300 rounded-lg
                  focus:ring-2 focus:ring-emerald-500
                  placeholder:text-gray-500 text-gray-900"
                  onChange={(e) =>
                    setForm({ ...form, allergies: e.target.value })
                  }
                />

                <textarea
                  placeholder="Current Medications"
                  rows={3}
                  className="p-4 border border-gray-300 rounded-lg
                  focus:ring-2 focus:ring-emerald-500
                  placeholder:text-gray-500 text-gray-900"
                  onChange={(e) =>
                    setForm({ ...form, currentMedications: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Emergency Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Emergency Contact
              </h2>

              <div className="grid grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Emergency Contact Name"
                  className="p-4 border border-gray-300 rounded-lg
                  focus:ring-2 focus:ring-emerald-500
                  placeholder:text-gray-500 text-gray-900"
                  onChange={(e) =>
                    setForm({ ...form, emergencyContactName: e.target.value })
                  }
                />

                <input
                  type="text"
                  placeholder="Emergency Contact Phone"
                  className="p-4 border border-gray-300 rounded-lg
                  focus:ring-2 focus:ring-emerald-500
                  placeholder:text-gray-500 text-gray-900"
                  onChange={(e) =>
                    setForm({ ...form, emergencyContactPhone: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-4 rounded-lg
              hover:bg-emerald-700 transition font-medium"
            >
              Register Patient
            </button>

          </form>
        ) : (
          <div className="bg-white p-10 rounded-2xl shadow-md border border-gray-200 max-w-3xl">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Patient Registered Successfully
            </h2>

            <p className="text-gray-600 mb-4">
              Save this biometric token securely. It cannot be retrieved later.
            </p>

            <div className="bg-gray-900 text-emerald-400 p-6 rounded-lg font-mono text-sm break-all">
              {biometricToken}
            </div>

            <button
              onClick={() => router.push("/dashboard")}
              className="mt-8 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-black transition"
            >
              Back to Dashboard
            </button>
          </div>
        )}

      </main>
    </div>
  );
}