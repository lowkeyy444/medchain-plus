"use client";

import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Stage = "idle" | "waiting" | "approved";

export default function EmergencyPage() {
  const router = useRouter();
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [stage, setStage] = useState<Stage>("idle");
  const [generating, setGenerating] = useState(false);

  async function generateQR() {
    setGenerating(true);
    const token = localStorage.getItem("token");
    const res = await fetch("/api/emergency/session", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    const url = window.location.origin + "/biometric/auth?session=" + data.sessionId;
    setSessionId(data.sessionId);
    setQrUrl(url);
    setStage("waiting");
    setGenerating(false);
  }

  useEffect(() => {
    if (!sessionId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/biometric/auth/session?session=${sessionId}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.status === "approved") {
          setStage("approved");
          clearInterval(interval);
          setTimeout(() => {
            if (data.accessType === "EMERGENCY") {
              window.location.href = `/dashboard/patient/${data.patientId}/emergency`;
            } else {
              window.location.href = `/dashboard/patient/${data.patientId}`;
            }
          }, 800);
        }
      } catch (err) {
        console.error("Session polling error:", err);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionId]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .em-layout { font-family:'DM Sans',sans-serif; min-height:100vh; display:flex; background:#f9fafb; color:#111827; }

        /* ── SIDEBAR ── */
        .em-sidebar { width:240px; flex-shrink:0; background:white; border-right:1px solid #f3f4f6; display:flex; flex-direction:column; padding:32px 24px; position:sticky; top:0; height:100vh; }
        .em-logo { font-family:'Lora',serif; font-size:1.2rem; font-weight:600; color:#064e3b; display:flex; align-items:center; gap:8px; text-decoration:none; margin-bottom:40px; }
        .em-logo-dot { width:8px; height:8px; background:#10b981; border-radius:50%; }
        .em-nav { display:flex; flex-direction:column; gap:4px; flex:1; }
        .em-nav-item { display:flex; align-items:center; gap:10px; font-size:0.875rem; font-weight:500; color:#6b7280; text-decoration:none; padding:9px 12px; border-radius:10px; transition:background 0.15s,color 0.15s; }
        .em-nav-item:hover { background:#f3f4f6; color:#111827; }
        .em-nav-item.active { background:#fef2f2; color:#ef4444; }
        .em-sidebar-footer { border-top:1px solid #f3f4f6; padding-top:20px; }
        .em-logout { display:flex; align-items:center; gap:10px; font-size:0.875rem; font-weight:500; color:#9ca3af; background:none; border:none; cursor:pointer; padding:9px 12px; border-radius:10px; width:100%; transition:background 0.15s,color 0.15s; font-family:'DM Sans',sans-serif; }
        .em-logout:hover { background:#fef2f2; color:#ef4444; }

        /* ── MAIN ── */
        .em-main { flex:1; padding:40px 48px; display:flex; flex-direction:column; gap:24px; max-width:780px; }

        /* ── EYEBROW ── */
        .em-eyebrow { display:inline-flex; align-items:center; gap:7px; background:#fef2f2; border:1px solid #fecaca; border-radius:100px; padding:5px 14px; font-size:0.72rem; font-weight:700; color:#991b1b; letter-spacing:0.07em; text-transform:uppercase; width:fit-content; }

        /* ── HEADING ── */
        .em-heading { font-family:'Lora',serif; font-size:1.8rem; font-weight:600; color:#064e3b; line-height:1.2; margin-top:8px; }
        .em-subheading { font-size:0.9rem; color:#6b7280; font-weight:300; margin-top:6px; line-height:1.6; max-width:480px; }

        /* ── CARD ── */
        .em-card { background:white; border:1px solid #e5e7eb; border-radius:20px; box-shadow:0 2px 12px rgba(0,0,0,0.04); padding:32px; }

        /* ── IDLE STATE ── */
        .em-idle-icon { width:64px; height:64px; border-radius:18px; background:#fef2f2; border:1px solid #fecaca; display:flex; align-items:center; justify-content:center; margin-bottom:20px; }
        .em-idle-title { font-family:'Lora',serif; font-size:1.15rem; font-weight:600; color:#111827; margin-bottom:8px; }
        .em-idle-desc { font-size:0.875rem; color:#6b7280; font-weight:300; line-height:1.65; margin-bottom:24px; max-width:440px; }

        /* ── GENERATE BUTTON ── */
        .em-btn-emergency {
          font-family:'DM Sans',sans-serif; font-size:0.875rem; font-weight:600;
          display:inline-flex; align-items:center; gap:8px;
          padding:11px 22px; border-radius:10px; cursor:pointer; border:none;
          background:#dc2626; color:white;
          box-shadow:0 1px 3px rgba(220,38,38,0.3);
          transition:background 0.2s,box-shadow 0.2s,transform 0.15s;
        }
        .em-btn-emergency:hover { background:#b91c1c; box-shadow:0 4px 14px rgba(220,38,38,0.35); transform:translateY(-1px); }
        .em-btn-emergency:disabled { opacity:0.65; cursor:not-allowed; transform:none; }

        /* ── WAITING STATE ── */
        .em-qr-wrap {
          display:flex; gap:32px; align-items:flex-start;
        }
        .em-qr-box {
          flex-shrink:0;
          background:white; border:2px solid #fecaca; border-radius:16px;
          padding:16px; display:flex; align-items:center; justify-content:center;
          box-shadow:0 0 0 6px rgba(220,38,38,0.06);
        }
        .em-qr-info { flex:1; display:flex; flex-direction:column; gap:14px; padding-top:4px; }
        .em-qr-title { font-family:'Lora',serif; font-size:1.05rem; font-weight:600; color:#111827; }
        .em-qr-desc { font-size:0.84rem; color:#6b7280; font-weight:300; line-height:1.65; }

        .em-pulse-badge {
          display:inline-flex; align-items:center; gap:8px;
          background:#fef2f2; border:1px solid #fecaca; border-radius:100px;
          padding:6px 14px; font-size:0.75rem; font-weight:600; color:#dc2626;
          width:fit-content;
        }
        .em-pulse-dot { width:8px; height:8px; border-radius:50%; background:#dc2626; }
        @keyframes em-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.75)} }
        .em-pulse-dot { animation:em-pulse 1.4s ease-in-out infinite; }

        .em-steps { display:flex; flex-direction:column; gap:9px; padding-top:4px; }
        .em-step { display:flex; align-items:center; gap:10px; font-size:0.78rem; color:#6b7280; }
        .em-step-num { width:20px; height:20px; border-radius:50%; background:#f3f4f6; border:1px solid #e5e7eb; display:flex; align-items:center; justify-content:center; font-size:0.65rem; font-weight:700; color:#9ca3af; flex-shrink:0; }

        /* ── APPROVED STATE ── */
        .em-approved-icon { width:56px; height:56px; border-radius:16px; background:#f0fdf9; border:1px solid #d1fae5; display:flex; align-items:center; justify-content:center; margin-bottom:16px; }
        .em-approved-title { font-family:'Lora',serif; font-size:1.1rem; font-weight:600; color:#065f46; margin-bottom:6px; }
        .em-approved-desc { font-size:0.875rem; color:#6b7280; font-weight:300; }

        /* ── WARNING STRIP ── */
        .em-warning {
          display:flex; align-items:flex-start; gap:12px;
          background:#fffbeb; border:1px solid #fde68a; border-radius:14px;
          padding:16px 20px;
        }
        .em-warning-icon { flex-shrink:0; margin-top:1px; color:#d97706; }
        .em-warning-text { font-size:0.8rem; color:#78350f; line-height:1.6; }
        .em-warning-title { font-weight:600; margin-bottom:2px; }

        /* ── REGENERATE ── */
        .em-btn-outline {
          font-family:'DM Sans',sans-serif; font-size:0.78rem; font-weight:600;
          display:inline-flex; align-items:center; gap:6px;
          padding:7px 14px; border-radius:9px; cursor:pointer;
          background:white; color:#374151; border:1px solid #e5e7eb;
          transition:background 0.15s,border-color 0.15s;
        }
        .em-btn-outline:hover { background:#f9fafb; border-color:#d1d5db; }

        @keyframes spin { to{transform:rotate(360deg)} }
        .em-spinner { width:14px; height:14px; border:2px solid rgba(255,255,255,0.4); border-top-color:white; border-radius:50%; animation:spin 0.7s linear infinite; }

        @keyframes em-fade-up { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .em-anim { animation:em-fade-up 0.4s ease both; }
        .em-d1 { animation-delay:0.05s; }
        .em-d2 { animation-delay:0.12s; }
        .em-d3 { animation-delay:0.18s; }

        @media (max-width:768px) {
          .em-sidebar { display:none; }
          .em-main { padding:24px 20px; }
          .em-qr-wrap { flex-direction:column; align-items:center; }
          .em-qr-info { padding-top:0; }
        }
      `}</style>

      <div className="em-layout">

        {/* ── SIDEBAR ── */}
        <aside className="em-sidebar">
          <a href="/" className="em-logo">
            <span className="em-logo-dot"/>
            MedChain+
          </a>
          <nav className="em-nav">
            <Link href="/dashboard" className="em-nav-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <rect x="3" y="3" width="7" height="7" rx="1.5"/>
                <rect x="14" y="3" width="7" height="7" rx="1.5"/>
                <rect x="3" y="14" width="7" height="7" rx="1.5"/>
                <rect x="14" y="14" width="7" height="7" rx="1.5"/>
              </svg>
              Dashboard
            </Link>
            <Link href="/dashboard/register-patient" className="em-nav-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <line x1="19" y1="8" x2="19" y2="14"/>
                <line x1="16" y1="11" x2="22" y2="11"/>
              </svg>
              Register Patient
            </Link>
            <Link href="/dashboard/search" className="em-nav-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
              Biometric Search
            </Link>
            <a href="/dashboard/emergency" className="em-nav-item active">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
              Emergency Access
            </a>
          </nav>
          <div className="em-sidebar-footer">
            <button className="em-logout" onClick={() => { localStorage.removeItem("token"); window.location.href = "/login"; }}>
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
        <main className="em-main">

          {/* Page heading */}
          <div className="em-anim em-d1">
            <div className="em-eyebrow">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
              Emergency Protocol
            </div>
            <h1 className="em-heading">Emergency Access</h1>
            <p className="em-subheading">
              Generate a one-time QR code for a patient to authenticate via biometrics and grant immediate access to their medical records.
            </p>
          </div>

          {/* Warning strip */}
          <div className="em-warning em-anim em-d2">
            <div className="em-warning-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <div className="em-warning-text">
              <p className="em-warning-title">For emergency use only</p>
              Every access event is logged and audited. Emergency access grants full record visibility to the treating doctor.
            </div>
          </div>

          {/* Main card */}
          <div className="em-card em-anim em-d3">

            {/* ── IDLE ── */}
            {stage === "idle" && (
              <div>
                <div className="em-idle-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="1.75">
                    <rect x="3" y="11" width="18" height="11" rx="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    <circle cx="12" cy="16" r="1" fill="#dc2626"/>
                  </svg>
                </div>
                <h2 className="em-idle-title">Ready to generate access QR</h2>
                <p className="em-idle-desc">
                  Present the QR code to the patient. They will scan it with their phone and complete biometric verification — you will be redirected to their record automatically.
                </p>
                <button className="em-btn-emergency" onClick={generateQR} disabled={generating}>
                  {generating ? (
                    <span className="em-spinner"/>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                    </svg>
                  )}
                  {generating ? "Generating…" : "Generate Emergency QR"}
                </button>
              </div>
            )}

            {/* ── WAITING ── */}
            {stage === "waiting" && qrUrl && (
              <div>
                <div className="em-qr-wrap">

                  {/* QR code */}
                  <div className="em-qr-box">
                    <QRCodeCanvas
                      value={qrUrl}
                      size={200}
                      bgColor="#ffffff"
                      fgColor="#111827"
                      level="M"
                    />
                  </div>

                  {/* Right side info */}
                  <div className="em-qr-info">
                    <h2 className="em-qr-title">Scan to authenticate</h2>
                    <p className="em-qr-desc">
                      Ask the patient to open their camera and scan this code. They will be prompted to verify using their registered biometric.
                    </p>

                    <div className="em-pulse-badge">
                      <span className="em-pulse-dot"/>
                      Waiting for patient scan…
                    </div>

                    <div className="em-steps">
                      {[
                        "Patient scans the QR with their phone",
                        "Biometric prompt appears on their device",
                        "You are redirected automatically on approval",
                      ].map((step, i) => (
                        <div key={i} className="em-step">
                          <span className="em-step-num">{i + 1}</span>
                          {step}
                        </div>
                      ))}
                    </div>

                    <div>
                      <button className="em-btn-outline" onClick={generateQR}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="1 4 1 10 7 10"/>
                          <path d="M3.51 15a9 9 0 1 0 .49-4"/>
                        </svg>
                        Regenerate QR
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── APPROVED ── */}
            {stage === "approved" && (
              <div style={{textAlign:"center", padding:"16px 0"}}>
                <div className="em-approved-icon" style={{margin:"0 auto 16px"}}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                    <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z"/>
                    <path d="M9 12l2 2 4-4"/>
                  </svg>
                </div>
                <h2 className="em-approved-title">Access granted</h2>
                <p className="em-approved-desc">Biometric verified. Redirecting to patient record…</p>
              </div>
            )}

          </div>
        </main>
      </div>
    </>
  );
}