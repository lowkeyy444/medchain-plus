"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPatient() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [biometricToken, setBiometricToken] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "", dateOfBirth: "", gender: "", phone: "", email: "",
    address: "", bloodGroup: "", allergies: "", currentMedications: "",
    emergencyContactName: "", emergencyContactPhone: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, []);

  function set(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm({ ...form, [field]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");
    const res = await fetch("/api/patients", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      setBiometricToken(data.biometricToken);
    } else {
      alert(data.error);
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .rp-layout {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          display: flex;
          background: #f9fafb;
          color: #111827;
        }

        /* ── SIDEBAR ── */
        .rp-sidebar {
          width: 240px; flex-shrink: 0;
          background: white; border-right: 1px solid #f3f4f6;
          display: flex; flex-direction: column;
          padding: 32px 24px;
          position: sticky; top: 0; height: 100vh;
        }
        .rp-logo {
          font-family: 'Lora', serif; font-size: 1.2rem; font-weight: 600;
          color: #064e3b; display: flex; align-items: center; gap: 8px;
          text-decoration: none; margin-bottom: 40px;
        }
        .rp-logo-dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; }
        .rp-nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }
        .rp-nav-item {
          display: flex; align-items: center; gap: 10px;
          font-size: 0.875rem; font-weight: 500; color: #6b7280;
          text-decoration: none; padding: 9px 12px; border-radius: 10px;
          transition: background 0.15s, color 0.15s;
        }
        .rp-nav-item:hover { background: #f3f4f6; color: #111827; }
        .rp-nav-item.active { background: #f0fdf9; color: #065f46; font-weight: 600; }
        .rp-nav-item.active svg { stroke: #10b981; }
        .rp-sidebar-footer { border-top: 1px solid #f3f4f6; padding-top: 20px; }
        .rp-logout {
          display: flex; align-items: center; gap: 10px;
          font-size: 0.875rem; font-weight: 500; color: #9ca3af;
          background: none; border: none; cursor: pointer;
          padding: 9px 12px; border-radius: 10px; width: 100%;
          transition: background 0.15s, color 0.15s; font-family: 'DM Sans', sans-serif;
        }
        .rp-logout:hover { background: #fef2f2; color: #ef4444; }

        /* ── MAIN ── */
        .rp-main { flex: 1; padding: 48px 56px; max-width: 860px; }

        .rp-eyebrow {
          display: inline-flex; align-items: center; gap: 6px;
          background: #f0fdf9; color: #065f46;
          font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
          padding: 5px 12px; border-radius: 100px; border: 1px solid #d1fae5; margin-bottom: 14px;
        }
        .rp-title {
          font-family: 'Lora', serif; font-size: 2rem; font-weight: 600;
          color: #064e3b; line-height: 1.2; letter-spacing: -0.02em; margin-bottom: 6px;
        }
        .rp-subtitle {
          font-size: 0.9rem; color: #6b7280; font-weight: 300;
          line-height: 1.6; margin-bottom: 32px;
        }

        /* ── FORM ── */
        .rp-form {
          background: white; border: 1px solid #e5e7eb;
          border-radius: 20px; padding: 36px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        }

        .rp-section { margin-bottom: 32px; }
        .rp-section:last-of-type { margin-bottom: 0; }

        .rp-section-header {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 20px; padding-bottom: 14px;
          border-bottom: 1px solid #f3f4f6;
        }
        .rp-section-icon {
          width: 32px; height: 32px; border-radius: 8px;
          background: #f0fdf9; border: 1px solid #d1fae5;
          display: flex; align-items: center; justify-content: center; color: #10b981; flex-shrink: 0;
        }
        .rp-section-title {
          font-size: 0.9rem; font-weight: 600; color: #111827;
        }

        .rp-grid { display: grid; gap: 14px; }
        .rp-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

        .rp-field { display: flex; flex-direction: column; gap: 5px; }
        .rp-label { font-size: 0.75rem; font-weight: 600; color: #374151; }

        .rp-input, .rp-select, .rp-textarea {
          font-family: 'DM Sans', sans-serif; font-size: 0.875rem; color: #111827;
          background: white; border: 1px solid #e5e7eb; border-radius: 10px;
          padding: 10px 13px; width: 100%; outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
        }
        .rp-input::placeholder, .rp-textarea::placeholder { color: #9ca3af; }
        .rp-input:focus, .rp-select:focus, .rp-textarea:focus {
          border-color: #10b981; box-shadow: 0 0 0 3px rgba(16,185,129,0.10);
        }
        .rp-select { color: #374151; appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%239CA3AF' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 12px center; padding-right: 36px;
        }
        .rp-textarea { resize: vertical; min-height: 80px; line-height: 1.5; }

        .rp-divider { height: 1px; background: #f3f4f6; margin: 28px 0; }

        .rp-btn {
          font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 600;
          color: white; background: #10b981; border: none; border-radius: 10px;
          padding: 13px; cursor: pointer; width: 100%; margin-top: 28px;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
          box-shadow: 0 1px 3px rgba(16,185,129,0.25);
        }
        .rp-btn:hover:not(:disabled) {
          background: #059669; box-shadow: 0 4px 14px rgba(16,185,129,0.3); transform: translateY(-1px);
        }
        .rp-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .rp-spinner {
          width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.35);
          border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite;
        }

        /* ── SUCCESS STATE ── */
        .rp-success {
          background: white; border: 1px solid #e5e7eb; border-radius: 20px;
          padding: 48px 40px; max-width: 560px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04); text-align: center;
        }
        .rp-success-icon {
          width: 56px; height: 56px; border-radius: 16px;
          background: #f0fdf9; border: 1px solid #d1fae5;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 20px; color: #10b981;
        }
        .rp-success-title {
          font-family: 'Lora', serif; font-size: 1.5rem; font-weight: 600;
          color: #064e3b; margin-bottom: 8px;
        }
        .rp-success-desc {
          font-size: 0.875rem; color: #6b7280; font-weight: 300;
          line-height: 1.65; margin-bottom: 24px;
        }
        .rp-token-box {
          background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 12px;
          padding: 16px 18px; font-family: 'Courier New', monospace;
          font-size: 0.8rem; color: #10b981; word-break: break-all;
          text-align: left; line-height: 1.7; margin-bottom: 24px;
        }
        .rp-token-label {
          font-size: 0.7rem; font-weight: 600; color: #9ca3af;
          letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 8px;
        }
        .rp-back-btn {
          font-family: 'DM Sans', sans-serif; font-size: 0.875rem; font-weight: 600;
          color: #374151; background: #f9fafb; border: 1px solid #e5e7eb;
          border-radius: 10px; padding: 11px 24px; cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
        }
        .rp-back-btn:hover { background: #f3f4f6; border-color: #d1d5db; }

        @keyframes rp-fade-up {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .rp-anim { animation: rp-fade-up 0.45s ease both; }

        @media (max-width: 768px) {
          .rp-sidebar { display: none; }
          .rp-main { padding: 32px 24px; }
          .rp-grid-2 { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="rp-layout">

        {/* ── SIDEBAR ── */}
        <aside className="rp-sidebar">
          <a href="/" className="rp-logo">
            <span className="rp-logo-dot"/>
            MedChain+
          </a>
          <nav className="rp-nav">
            <Link href="/dashboard" className="rp-nav-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <rect x="3" y="3" width="7" height="7" rx="1.5"/>
                <rect x="14" y="3" width="7" height="7" rx="1.5"/>
                <rect x="3" y="14" width="7" height="7" rx="1.5"/>
                <rect x="14" y="14" width="7" height="7" rx="1.5"/>
              </svg>
              Dashboard
            </Link>
            <Link href="/dashboard/register-patient" className="rp-nav-item active">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <line x1="19" y1="8" x2="19" y2="14"/>
                <line x1="16" y1="11" x2="22" y2="11"/>
              </svg>
              Register Patient
            </Link>
            <Link href="/dashboard/search" className="rp-nav-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
              Biometric Search
            </Link>
          </nav>
          <div className="rp-sidebar-footer">
            <button className="rp-logout" onClick={() => { localStorage.removeItem("token"); router.push("/login"); }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Sign out
            </button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className="rp-main">

          {!biometricToken ? (
            <div className="rp-anim">
              <div className="rp-eyebrow">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <line x1="19" y1="8" x2="19" y2="14"/>
                  <line x1="16" y1="11" x2="22" y2="11"/>
                </svg>
                New Enrolment
              </div>
              <h1 className="rp-title">Register Patient</h1>
              <p className="rp-subtitle">Fill in the patient details to generate a biometric identity token.</p>

              <form onSubmit={handleSubmit} className="rp-form">

                {/* Identity */}
                <div className="rp-section">
                  <div className="rp-section-header">
                    <div className="rp-section-icon">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                    </div>
                    <span className="rp-section-title">Identity Information</span>
                  </div>
                  <div className="rp-grid">
                    <div className="rp-field">
                      <label className="rp-label">Full Name</label>
                      <input className="rp-input" type="text" placeholder="e.g. John Doe" required onChange={set("name")}/>
                    </div>
                    <div className="rp-grid-2">
                      <div className="rp-field">
                        <label className="rp-label">Date of Birth</label>
                        <input className="rp-input" type="date" onChange={set("dateOfBirth")}/>
                      </div>
                      <div className="rp-field">
                        <label className="rp-label">Gender</label>
                        <select className="rp-select" onChange={set("gender")}>
                          <option value="">Select gender</option>
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>
                    </div>
                    <div className="rp-grid-2">
                      <div className="rp-field">
                        <label className="rp-label">Phone Number</label>
                        <input className="rp-input" type="text" placeholder="+1 234 567 8900" required onChange={set("phone")}/>
                      </div>
                      <div className="rp-field">
                        <label className="rp-label">Email Address</label>
                        <input className="rp-input" type="email" placeholder="patient@email.com" onChange={set("email")}/>
                      </div>
                    </div>
                    <div className="rp-field">
                      <label className="rp-label">Address</label>
                      <textarea className="rp-textarea" placeholder="Street, City, State, ZIP" rows={2} onChange={set("address")}/>
                    </div>
                  </div>
                </div>

                <div className="rp-divider"/>

                {/* Medical */}
                <div className="rp-section">
                  <div className="rp-section-header">
                    <div className="rp-section-icon">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                      </svg>
                    </div>
                    <span className="rp-section-title">Medical Information</span>
                  </div>
                  <div className="rp-grid">
                    <div className="rp-field">
                      <label className="rp-label">Blood Group</label>
                      <input className="rp-input" type="text" placeholder="e.g. A+, O−" onChange={set("bloodGroup")}/>
                    </div>
                    <div className="rp-field">
                      <label className="rp-label">Known Allergies</label>
                      <textarea className="rp-textarea" placeholder="List any known allergies…" rows={2} onChange={set("allergies")}/>
                    </div>
                    <div className="rp-field">
                      <label className="rp-label">Current Medications</label>
                      <textarea className="rp-textarea" placeholder="List current medications…" rows={2} onChange={set("currentMedications")}/>
                    </div>
                  </div>
                </div>

                <div className="rp-divider"/>

                {/* Emergency */}
                <div className="rp-section">
                  <div className="rp-section-header">
                    <div className="rp-section-icon">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                    </div>
                    <span className="rp-section-title">Emergency Contact</span>
                  </div>
                  <div className="rp-grid-2">
                    <div className="rp-field">
                      <label className="rp-label">Contact Name</label>
                      <input className="rp-input" type="text" placeholder="Full name" onChange={set("emergencyContactName")}/>
                    </div>
                    <div className="rp-field">
                      <label className="rp-label">Contact Phone</label>
                      <input className="rp-input" type="text" placeholder="+1 234 567 8900" onChange={set("emergencyContactPhone")}/>
                    </div>
                  </div>
                </div>

                <button type="submit" className="rp-btn" disabled={loading}>
                  {loading ? <span className="rp-spinner"/> : (
                    <>
                      Register Patient
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </>
                  )}
                </button>

              </form>
            </div>

          ) : (

            <div className="rp-success rp-anim">
              <div className="rp-success-icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z"/>
                  <path d="M9 12l2 2 4-4"/>
                </svg>
              </div>
              <h2 className="rp-success-title">Patient Registered</h2>
              <p className="rp-success-desc">
                The biometric token has been generated. Save it securely — it cannot be retrieved again.
              </p>
              <div className="rp-token-box">
                <p className="rp-token-label">Biometric Token</p>
                {biometricToken}
              </div>
              <button className="rp-back-btn" onClick={() => router.push("/dashboard")}>
                ← Back to Dashboard
              </button>
            </div>

          )}
        </main>
      </div>
    </>
  );
}