"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function EmergencyPatientPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem("token");
      if (!token) { router.push("/login"); return; }
      const res = await fetch(`/api/patients/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) { alert(data.error || "Failed to load patient"); return; }
      setPatient(data);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"DM Sans, sans-serif", color:"#6b7280" }}>
      Loading emergency record…
    </div>
  );

  const age = patient?.dateOfBirth
    ? new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()
    : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .ep-layout { font-family:'DM Sans',sans-serif; min-height:100vh; display:flex; background:#f9fafb; color:#111827; }

        /* ── SIDEBAR ── */
        .ep-sidebar { width:240px; flex-shrink:0; background:white; border-right:1px solid #f3f4f6; display:flex; flex-direction:column; padding:32px 24px; position:sticky; top:0; height:100vh; }
        .ep-logo { font-family:'Lora',serif; font-size:1.2rem; font-weight:600; color:#064e3b; display:flex; align-items:center; gap:8px; text-decoration:none; margin-bottom:40px; }
        .ep-logo-dot { width:8px; height:8px; background:#10b981; border-radius:50%; }
        .ep-nav { display:flex; flex-direction:column; gap:4px; flex:1; }
        .ep-nav-item { display:flex; align-items:center; gap:10px; font-size:0.875rem; font-weight:500; color:#6b7280; text-decoration:none; padding:9px 12px; border-radius:10px; transition:background 0.15s,color 0.15s; }
        .ep-nav-item:hover { background:#f3f4f6; color:#111827; }
        .ep-nav-item.active { background:#fef2f2; color:#ef4444; }
        .ep-sidebar-footer { border-top:1px solid #f3f4f6; padding-top:20px; }
        .ep-logout { display:flex; align-items:center; gap:10px; font-size:0.875rem; font-weight:500; color:#9ca3af; background:none; border:none; cursor:pointer; padding:9px 12px; border-radius:10px; width:100%; transition:background 0.15s,color 0.15s; font-family:'DM Sans',sans-serif; }
        .ep-logout:hover { background:#fef2f2; color:#ef4444; }

        /* ── MAIN ── */
        .ep-main { flex:1; padding:40px 48px 60px; display:flex; flex-direction:column; gap:20px; max-width:820px; }

        /* ── EMERGENCY BANNER ── */
        .ep-banner { background:#fef2f2; border:1px solid #fecaca; border-radius:16px; padding:16px 22px; display:flex; align-items:center; gap:14px; }
        .ep-banner-icon { width:38px; height:38px; border-radius:10px; background:#fee2e2; border:1px solid #fca5a5; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .ep-banner-title { font-size:0.82rem; font-weight:700; color:#991b1b; letter-spacing:0.06em; text-transform:uppercase; margin-bottom:2px; }
        .ep-banner-desc  { font-size:0.78rem; color:#b91c1c; font-weight:300; }

        /* ── CARD ── */
        .ep-card { background:white; border:1px solid #e5e7eb; border-radius:20px; box-shadow:0 2px 12px rgba(0,0,0,0.04); padding:28px 32px; }

        /* ── PATIENT IDENTITY ── */
        .ep-identity { display:flex; align-items:center; gap:16px; margin-bottom:24px; padding-bottom:22px; border-bottom:1px solid #f3f4f6; }
        .ep-avatar { width:52px; height:52px; border-radius:14px; background:#fef2f2; border:1px solid #fecaca; display:flex; align-items:center; justify-content:center; color:#dc2626; flex-shrink:0; }
        .ep-patient-name { font-family:'Lora',serif; font-size:1.5rem; font-weight:600; color:#064e3b; margin-bottom:4px; }
        .ep-patient-meta { font-size:0.82rem; color:#6b7280; display:flex; gap:10px; flex-wrap:wrap; }
        .ep-meta-dot { color:#d1d5db; }

        /* ── SECTION TITLE ── */
        .ep-section-title { font-family:'Lora',serif; font-size:1rem; font-weight:600; color:#064e3b; margin-bottom:16px; display:flex; align-items:center; gap:8px; }

        /* ── CRITICAL GRID ── */
        .ep-critical-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
        .ep-critical-item { border-radius:14px; padding:18px 20px; display:flex; flex-direction:column; gap:7px; }
        .ep-critical-item.red    { background:#fef2f2; border:1px solid #fecaca; }
        .ep-critical-item.amber  { background:#fffbeb; border:1px solid #fde68a; }
        .ep-critical-item.blue   { background:#eff6ff; border:1px solid #bfdbfe; }
        .ep-critical-item.purple { background:#faf5ff; border:1px solid #e9d5ff; }
        .ep-critical-label { display:flex; align-items:center; gap:7px; font-size:0.68rem; font-weight:700; letter-spacing:0.07em; text-transform:uppercase; }
        .ep-critical-value { font-size:0.95rem; font-weight:600; color:#111827; line-height:1.4; }
        .ep-critical-empty { font-size:0.85rem; color:#9ca3af; font-weight:300; }

        /* ── EMERGENCY CONTACT ── */
        .ep-contact { display:flex; align-items:center; gap:14px; }
        .ep-contact-icon { width:40px; height:40px; border-radius:11px; background:#f0fdf9; border:1px solid #d1fae5; display:flex; align-items:center; justify-content:center; color:#10b981; flex-shrink:0; }
        .ep-contact-name  { font-size:0.875rem; font-weight:600; color:#111827; margin-bottom:3px; }
        .ep-contact-phone { font-size:0.82rem; color:#6b7280; }
        .ep-call-btn { margin-left:auto; font-family:'DM Sans',sans-serif; font-size:0.78rem; font-weight:600; display:inline-flex; align-items:center; gap:6px; padding:7px 14px; border-radius:9px; cursor:pointer; background:#f0fdf9; color:#065f46; border:1px solid #d1fae5; text-decoration:none; transition:background 0.15s; }
        .ep-call-btn:hover { background:#dcfce7; }

        @keyframes ep-fade-up { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .ep-anim { animation:ep-fade-up 0.4s ease both; }
        .ep-d1 { animation-delay:0.04s; }
        .ep-d2 { animation-delay:0.10s; }
        .ep-d3 { animation-delay:0.16s; }

        @media (max-width:768px) {
          .ep-sidebar { display:none; }
          .ep-main { padding:20px 16px 40px; }
          .ep-critical-grid { grid-template-columns:1fr; }
          .ep-identity { flex-wrap:wrap; }
        }
      `}</style>

      <div className="ep-layout">

        {/* ── SIDEBAR ── */}
        <aside className="ep-sidebar">
          <a href="/" className="ep-logo">
            <span className="ep-logo-dot"/>
            MedChain+
          </a>
          <nav className="ep-nav">
            <Link href="/dashboard" className="ep-nav-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <rect x="3" y="3" width="7" height="7" rx="1.5"/>
                <rect x="14" y="3" width="7" height="7" rx="1.5"/>
                <rect x="3" y="14" width="7" height="7" rx="1.5"/>
                <rect x="14" y="14" width="7" height="7" rx="1.5"/>
              </svg>
              Dashboard
            </Link>
            <Link href="/dashboard/register-patient" className="ep-nav-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <line x1="19" y1="8" x2="19" y2="14"/>
                <line x1="16" y1="11" x2="22" y2="11"/>
              </svg>
              Register Patient
            </Link>
            <Link href="/dashboard/search" className="ep-nav-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
              Biometric Search
            </Link>
            <Link href="/dashboard/emergency" className="ep-nav-item active">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
              Emergency Access
            </Link>
          </nav>
          <div className="ep-sidebar-footer">
            <button className="ep-logout" onClick={() => { localStorage.removeItem("token"); window.location.href = "/login"; }}>
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
        <main className="ep-main">

          {/* ── BANNER ── */}
          <div className="ep-banner ep-anim ep-d1">
            <div className="ep-banner-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <div>
              <p className="ep-banner-title">Emergency Mode Active</p>
              <p className="ep-banner-desc">Showing critical information only. This access is being logged and audited.</p>
            </div>
          </div>

          {/* ── PATIENT + CRITICAL INFO ── */}
          <div className="ep-card ep-anim ep-d2">

            {/* Identity */}
            <div className="ep-identity">
              <div className="ep-avatar">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div>
                <h1 className="ep-patient-name">{patient.name}</h1>
                <div className="ep-patient-meta">
                  {age && <span>{age} yrs</span>}
                  {patient.gender && <><span className="ep-meta-dot">·</span><span>{patient.gender}</span></>}
                  {patient.dateOfBirth && (
                    <><span className="ep-meta-dot">·</span>
                    <span>DOB: {new Date(patient.dateOfBirth).toLocaleDateString("en-US", { day:"numeric", month:"short", year:"numeric" })}</span></>
                  )}
                </div>
              </div>
            </div>

            {/* Critical grid */}
            <div className="ep-section-title">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              Critical Information
            </div>

            <div className="ep-critical-grid">

              <div className="ep-critical-item red">
                <div className="ep-critical-label" style={{color:"#dc2626"}}>
                  <svg width="10" height="10" viewBox="0 0 10 10"><circle cx="5" cy="5" r="5" fill="#dc2626"/></svg>
                  Blood Group
                </div>
                {patient.bloodGroup
                  ? <span className="ep-critical-value" style={{color:"#dc2626", fontSize:"1.35rem"}}>{patient.bloodGroup}</span>
                  : <span className="ep-critical-empty">Not recorded</span>}
              </div>

              <div className="ep-critical-item amber">
                <div className="ep-critical-label" style={{color:"#d97706"}}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
                  Allergies
                </div>
                {patient.allergies
                  ? <span className="ep-critical-value">{patient.allergies}</span>
                  : <span className="ep-critical-empty">None on record</span>}
              </div>

              <div className="ep-critical-item blue">
                <div className="ep-critical-label" style={{color:"#3b82f6"}}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                  Current Medications
                </div>
                {patient.currentMedications
                  ? <span className="ep-critical-value">{patient.currentMedications}</span>
                  : <span className="ep-critical-empty">None on record</span>}
              </div>

              <div className="ep-critical-item purple">
                <div className="ep-critical-label" style={{color:"#7c3aed"}}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  Chronic Conditions
                </div>
                {patient.chronicConditions
                  ? <span className="ep-critical-value">{patient.chronicConditions}</span>
                  : <span className="ep-critical-empty">None on record</span>}
              </div>

            </div>
          </div>

          {/* ── EMERGENCY CONTACT ── */}
          {(patient.emergencyContactName || patient.emergencyContactPhone) && (
            <div className="ep-card ep-anim ep-d3">
              <div className="ep-section-title">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#064e3b" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16z"/>
                </svg>
                Emergency Contact
              </div>
              <div className="ep-contact">
                <div className="ep-contact-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div>
                  <p className="ep-contact-name">{patient.emergencyContactName || "—"}</p>
                  <p className="ep-contact-phone">{patient.emergencyContactPhone || "—"}</p>
                </div>
                {patient.emergencyContactPhone && (
                  <a href={`tel:${patient.emergencyContactPhone}`} className="ep-call-btn">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16z"/>
                    </svg>
                    Call now
                  </a>
                )}
              </div>
            </div>
          )}

        </main>
      </div>
    </>
  );
}