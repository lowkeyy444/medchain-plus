"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { QRCodeCanvas } from "qrcode.react";

export default function SearchPage() {
  const [tokenInput, setTokenInput] = useState("");
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingQR, setLoadingQR] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, []);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoadingSearch(true);
    const token = localStorage.getItem("token");
    const res = await fetch("/api/patients/search", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ biometricToken: tokenInput }),
    });
    const data = await res.json();
    if (res.ok) {
      router.push(`/dashboard/patient/${data.patientId}`);
    } else {
      alert(data.error);
      setLoadingSearch(false);
    }
  }

  async function handleGenerateQR() {
    setLoadingQR(true);
    const token = localStorage.getItem("token");
    const res = await fetch("/api/biometric/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ doctorId: 1 }),
    });
    const data = await res.json();
    if (!res.ok) { alert(data.error); setLoadingQR(false); return; }
    setSessionId(data.sessionId);
    setQrUrl(window.location.origin + "/biometric/auth?session=" + data.sessionId);
    setLoadingQR(false);
  }

  useEffect(() => {
    if (!sessionId) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/access-session/status?session=${sessionId}`);
        const data = await res.json();
        if (data.status === "approved" && data.patientId) {
          clearInterval(interval);
          router.push(`/dashboard/patient/${data.patientId}`);
        }
        if (data.status === "rejected" || data.status === "expired") {
          clearInterval(interval);
          alert("Session expired or rejected.");
        }
      } catch (err) { console.error("Polling error:", err); }
    }, 2000);
    return () => clearInterval(interval);
  }, [sessionId, router]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .sp-layout {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh; display: flex;
          background: #f9fafb; color: #111827;
        }

        /* ── SIDEBAR ── */
        .sp-sidebar {
          width: 240px; flex-shrink: 0;
          background: white; border-right: 1px solid #f3f4f6;
          display: flex; flex-direction: column;
          padding: 32px 24px;
          position: sticky; top: 0; height: 100vh;
        }
        .sp-logo {
          font-family: 'Lora', serif; font-size: 1.2rem; font-weight: 600;
          color: #064e3b; display: flex; align-items: center; gap: 8px;
          text-decoration: none; margin-bottom: 40px;
        }
        .sp-logo-dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; }
        .sp-nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }
        .sp-nav-item {
          display: flex; align-items: center; gap: 10px;
          font-size: 0.875rem; font-weight: 500; color: #6b7280;
          text-decoration: none; padding: 9px 12px; border-radius: 10px;
          transition: background 0.15s, color 0.15s;
        }
        .sp-nav-item:hover { background: #f3f4f6; color: #111827; }
        .sp-nav-item.active { background: #f0fdf9; color: #065f46; font-weight: 600; }
        .sp-nav-item.active svg { stroke: #10b981; }
        .sp-sidebar-footer { border-top: 1px solid #f3f4f6; padding-top: 20px; }
        .sp-logout {
          display: flex; align-items: center; gap: 10px;
          font-size: 0.875rem; font-weight: 500; color: #9ca3af;
          background: none; border: none; cursor: pointer;
          padding: 9px 12px; border-radius: 10px; width: 100%;
          transition: background 0.15s, color 0.15s; font-family: 'DM Sans', sans-serif;
        }
        .sp-logout:hover { background: #fef2f2; color: #ef4444; }

        /* ── MAIN ── */
        .sp-main { flex: 1; padding: 48px 56px; max-width: 780px; }

        .sp-eyebrow {
          display: inline-flex; align-items: center; gap: 6px;
          background: #f0fdf9; color: #065f46;
          font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
          padding: 5px 12px; border-radius: 100px; border: 1px solid #d1fae5; margin-bottom: 14px;
        }
        .sp-title {
          font-family: 'Lora', serif; font-size: 2rem; font-weight: 600;
          color: #064e3b; line-height: 1.2; letter-spacing: -0.02em; margin-bottom: 6px;
        }
        .sp-subtitle {
          font-size: 0.9rem; color: #6b7280; font-weight: 300;
          line-height: 1.6; margin-bottom: 36px;
        }

        /* ── CARDS ── */
        .sp-card {
          background: white; border: 1px solid #e5e7eb; border-radius: 20px;
          padding: 32px; box-shadow: 0 2px 12px rgba(0,0,0,0.04); margin-bottom: 16px;
        }

        .sp-card-header {
          display: flex; align-items: center; gap: 12px; margin-bottom: 24px;
        }
        .sp-card-icon {
          width: 40px; height: 40px; border-radius: 10px;
          background: #f0fdf9; border: 1px solid #d1fae5;
          display: flex; align-items: center; justify-content: center;
          color: #10b981; flex-shrink: 0;
        }
        .sp-card-icon.blue {
          background: #eff6ff; border-color: #bfdbfe; color: #3b82f6;
        }
        .sp-card-title { font-size: 1rem; font-weight: 600; color: #111827; }
        .sp-card-desc { font-size: 0.8rem; color: #9ca3af; margin-top: 1px; }

        .sp-field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px; }
        .sp-label { font-size: 0.75rem; font-weight: 600; color: #374151; }
        .sp-input {
          font-family: 'DM Sans', sans-serif; font-size: 0.875rem; color: #111827;
          background: white; border: 1px solid #e5e7eb; border-radius: 10px;
          padding: 11px 14px; width: 100%; outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
        }
        .sp-input::placeholder { color: #9ca3af; }
        .sp-input:focus { border-color: #10b981; box-shadow: 0 0 0 3px rgba(16,185,129,0.10); }

        .sp-btn {
          font-family: 'DM Sans', sans-serif; font-size: 0.875rem; font-weight: 600;
          color: white; background: #10b981; border: none; border-radius: 10px;
          padding: 12px; cursor: pointer; width: 100%;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
          box-shadow: 0 1px 3px rgba(16,185,129,0.25);
        }
        .sp-btn:hover:not(:disabled) {
          background: #059669; box-shadow: 0 4px 14px rgba(16,185,129,0.3); transform: translateY(-1px);
        }
        .sp-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        .sp-btn.sp-btn-blue {
          background: #3b82f6; box-shadow: 0 1px 3px rgba(59,130,246,0.25);
        }
        .sp-btn.sp-btn-blue:hover:not(:disabled) {
          background: #2563eb; box-shadow: 0 4px 14px rgba(59,130,246,0.3);
        }

        /* ── DIVIDER ── */
        .sp-or {
          display: flex; align-items: center; gap: 14px; margin: 8px 0;
        }
        .sp-or-line { flex: 1; height: 1px; background: #f3f4f6; }
        .sp-or-text { font-size: 0.75rem; color: #d1d5db; font-weight: 500; }

        /* ── QR STATE ── */
        .sp-qr-wrap {
          display: flex; flex-direction: column; align-items: center;
          gap: 16px; padding-top: 24px; margin-top: 24px;
          border-top: 1px solid #f3f4f6;
        }
        .sp-qr-box {
          background: white; border: 1px solid #e5e7eb; border-radius: 16px;
          padding: 20px; display: inline-flex;
        }
        .sp-qr-label {
          font-size: 0.8rem; color: #6b7280; text-align: center; line-height: 1.6;
        }
        .sp-polling-badge {
          display: inline-flex; align-items: center; gap: 7px;
          background: #f0fdf9; border: 1px solid #d1fae5;
          border-radius: 100px; padding: 5px 12px;
          font-size: 0.72rem; font-weight: 600; color: #065f46;
        }
        .sp-pulse {
          width: 7px; height: 7px; border-radius: 50%; background: #10b981;
          animation: sp-pulse 1.4s ease-in-out infinite;
        }
        @keyframes sp-pulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.4; transform: scale(0.85); }
        }

        @keyframes spin { to { transform: rotate(360deg); } }
        .sp-spinner {
          width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.35);
          border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite;
        }

        @keyframes sp-fade-up {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sp-anim { animation: sp-fade-up 0.45s ease both; }

        @media (max-width: 768px) {
          .sp-sidebar { display: none; }
          .sp-main { padding: 32px 24px; }
        }
      `}</style>

      <div className="sp-layout">

        {/* ── SIDEBAR ── */}
        <aside className="sp-sidebar">
          <a href="/" className="sp-logo">
            <span className="sp-logo-dot"/>
            MedChain+
          </a>
          <nav className="sp-nav">
            <Link href="/dashboard" className="sp-nav-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <rect x="3" y="3" width="7" height="7" rx="1.5"/>
                <rect x="14" y="3" width="7" height="7" rx="1.5"/>
                <rect x="3" y="14" width="7" height="7" rx="1.5"/>
                <rect x="14" y="14" width="7" height="7" rx="1.5"/>
              </svg>
              Dashboard
            </Link>
            <Link href="/dashboard/register-patient" className="sp-nav-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <line x1="19" y1="8" x2="19" y2="14"/>
                <line x1="16" y1="11" x2="22" y2="11"/>
              </svg>
              Register Patient
            </Link>
            <Link href="/dashboard/search" className="sp-nav-item active">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
              Biometric Search
            </Link>
          </nav>
          <div className="sp-sidebar-footer">
            <button className="sp-logout" onClick={() => { localStorage.removeItem("token"); router.push("/login"); }}>
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
        <main className="sp-main">
          <div className="sp-anim">
            <div className="sp-eyebrow">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
              Patient Access
            </div>
            <h1 className="sp-title">Biometric Search</h1>
            <p className="sp-subtitle">Look up a patient by their biometric token, or authenticate via QR scan.</p>
          </div>

          {/* Token Search */}
          <div className="sp-card sp-anim" style={{animationDelay:"0.08s"}}>
            <div className="sp-card-header">
              <div className="sp-card-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  <circle cx="12" cy="16" r="1.5" fill="currentColor"/>
                </svg>
              </div>
              <div>
                <p className="sp-card-title">Search by Biometric Token</p>
                <p className="sp-card-desc">Paste the patient's unique token to retrieve their record</p>
              </div>
            </div>
            <form onSubmit={handleSearch}>
              <div className="sp-field">
                <label className="sp-label">Biometric Token</label>
                <input
                  className="sp-input"
                  type="text"
                  placeholder="Paste token here…"
                  required
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                />
              </div>
              <button type="submit" className="sp-btn" disabled={loadingSearch}>
                {loadingSearch ? <span className="sp-spinner"/> : (
                  <>
                    Search Patient
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* OR divider */}
          <div className="sp-or">
            <div className="sp-or-line"/>
            <span className="sp-or-text">OR</span>
            <div className="sp-or-line"/>
          </div>

          {/* QR Auth */}
          <div className="sp-card sp-anim" style={{animationDelay:"0.16s"}}>
            <div className="sp-card-header">
              <div className="sp-card-icon blue">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <rect x="3" y="3" width="7" height="7" rx="1"/>
                  <rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" rx="1"/>
                  <rect x="16" y="16" width="2" height="2" fill="currentColor"/>
                  <rect x="19" y="16" width="2" height="2" fill="currentColor"/>
                  <rect x="16" y="19" width="5" height="2" fill="currentColor"/>
                </svg>
              </div>
              <div>
                <p className="sp-card-title">Authenticate via QR Code</p>
                <p className="sp-card-desc">Generate a QR for the patient to scan with their biometric device</p>
              </div>
            </div>

            <button
              className="sp-btn sp-btn-blue"
              onClick={handleGenerateQR}
              disabled={loadingQR || !!qrUrl}
            >
              {loadingQR ? <span className="sp-spinner"/> : (
                <>
                  {qrUrl ? "QR Generated" : "Generate QR Code"}
                  {!qrUrl && (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  )}
                </>
              )}
            </button>

            {qrUrl && (
              <div className="sp-qr-wrap">
                <div className="sp-qr-box">
                  <QRCodeCanvas value={qrUrl} size={200}/>
                </div>
                <div className="sp-polling-badge">
                  <span className="sp-pulse"/>
                  Waiting for patient scan…
                </div>
                <p className="sp-qr-label">
                  Ask the patient to scan this QR code to authenticate via biometrics.
                </p>
              </div>
            )}
          </div>

        </main>
      </div>
    </>
  );
}