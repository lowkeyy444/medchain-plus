"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const router = useRouter();
  const [doctorName, setDoctorName] = useState("Doctor");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
    // Optionally decode name from JWT here
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .db-layout {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          display: flex;
          background: #f9fafb;
          color: #111827;
        }

        /* ── SIDEBAR ── */
        .db-sidebar {
          width: 240px;
          flex-shrink: 0;
          background: white;
          border-right: 1px solid #f3f4f6;
          display: flex;
          flex-direction: column;
          padding: 32px 24px;
          position: sticky;
          top: 0;
          height: 100vh;
        }

        .db-logo {
          font-family: 'Lora', serif;
          font-size: 1.2rem;
          font-weight: 600;
          color: #064e3b;
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          margin-bottom: 40px;
        }
        .db-logo-dot {
          width: 8px; height: 8px;
          background: #10b981;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .db-nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }

        .db-nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.875rem;
          font-weight: 500;
          color: #6b7280;
          text-decoration: none;
          padding: 9px 12px;
          border-radius: 10px;
          transition: background 0.15s, color 0.15s;
        }
        .db-nav-item:hover { background: #f3f4f6; color: #111827; }
        .db-nav-item.active {
          background: #f0fdf9;
          color: #065f46;
          font-weight: 600;
        }
        .db-nav-item.active svg { stroke: #10b981; }
        .db-nav-item.emergency { color: #6b7280; }
        .db-nav-item.emergency:hover { background: #fef2f2; color: #dc2626; }

        .db-nav-divider {
          height: 1px;
          background: #f3f4f6;
          margin: 8px 0;
        }

        .db-nav-icon {
          width: 16px; height: 16px;
          flex-shrink: 0;
          stroke: currentColor;
        }

        .db-sidebar-footer {
          border-top: 1px solid #f3f4f6;
          padding-top: 20px;
        }

        .db-logout {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.875rem;
          font-weight: 500;
          color: #9ca3af;
          background: none;
          border: none;
          cursor: pointer;
          padding: 9px 12px;
          border-radius: 10px;
          width: 100%;
          transition: background 0.15s, color 0.15s;
          font-family: 'DM Sans', sans-serif;
        }
        .db-logout:hover { background: #fef2f2; color: #ef4444; }

        /* ── MAIN ── */
        .db-main {
          flex: 1;
          padding: 48px 56px;
          max-width: 900px;
        }

        .db-welcome { margin-bottom: 40px; }

        .db-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #f0fdf9;
          color: #065f46;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 5px 12px;
          border-radius: 100px;
          border: 1px solid #d1fae5;
          margin-bottom: 14px;
        }

        .db-title {
          font-family: 'Lora', serif;
          font-size: 2rem;
          font-weight: 600;
          color: #064e3b;
          line-height: 1.2;
          letter-spacing: -0.02em;
          margin-bottom: 6px;
        }
        .db-title em { font-style: italic; color: #10b981; }

        .db-subtitle {
          font-size: 0.9rem;
          color: #6b7280;
          font-weight: 300;
          line-height: 1.6;
        }

        /* ── ACTION CARDS ── */
        .db-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .db-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 28px;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          gap: 16px;
          transition: box-shadow 0.2s, border-color 0.2s, transform 0.15s;
        }
        .db-card:hover {
          box-shadow: 0 8px 32px rgba(16,185,129,0.10);
          border-color: #a7f3d0;
          transform: translateY(-2px);
        }

        /* Emergency card variant */
        .db-card.db-card-emergency {
          grid-column: 1 / -1;
          flex-direction: row;
          align-items: center;
          gap: 20px;
          background: white;
          border-color: #fecaca;
        }
        .db-card.db-card-emergency:hover {
          box-shadow: 0 8px 32px rgba(220,38,38,0.10);
          border-color: #fca5a5;
          transform: translateY(-2px);
        }
        .db-card.db-card-emergency .db-card-body { flex: 1; }
        .db-card.db-card-emergency .db-card-arrow { color: #dc2626; margin-top: 0; }

        .db-card-icon {
          width: 44px; height: 44px;
          background: #f0fdf9;
          border: 1px solid #d1fae5;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #10b981;
          flex-shrink: 0;
        }
        .db-card-icon.emergency {
          background: #fef2f2;
          border-color: #fecaca;
          color: #dc2626;
        }

        .db-card-title {
          font-size: 1rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 4px;
        }

        .db-card-desc {
          font-size: 0.83rem;
          color: #6b7280;
          line-height: 1.65;
          font-weight: 300;
        }

        .db-card-arrow {
          margin-top: auto;
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.8rem;
          font-weight: 600;
          color: #10b981;
          white-space: nowrap;
        }

        .db-section-label {
          font-size: 0.7rem;
          font-weight: 700;
          color: #9ca3af;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          margin-bottom: 12px;
          margin-top: 32px;
        }

        @keyframes db-fade-up {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .db-anim { animation: db-fade-up 0.45s ease both; }
        .db-d1 { animation-delay: 0.05s; }
        .db-d2 { animation-delay: 0.12s; }
        .db-d3 { animation-delay: 0.20s; }
        .db-d4 { animation-delay: 0.28s; }

        @media (max-width: 768px) {
          .db-sidebar { display: none; }
          .db-main { padding: 32px 24px; }
          .db-cards { grid-template-columns: 1fr; }
          .db-card.db-card-emergency { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <div className="db-layout">

        {/* ── SIDEBAR ── */}
        <aside className="db-sidebar">
          <a href="/" className="db-logo">
            <span className="db-logo-dot"/>
            MedChain+
          </a>

          <nav className="db-nav">
            <Link href="/dashboard" className="db-nav-item active">
              <svg className="db-nav-icon" viewBox="0 0 24 24" fill="none" strokeWidth="1.75">
                <rect x="3" y="3" width="7" height="7" rx="1.5"/>
                <rect x="14" y="3" width="7" height="7" rx="1.5"/>
                <rect x="3" y="14" width="7" height="7" rx="1.5"/>
                <rect x="14" y="14" width="7" height="7" rx="1.5"/>
              </svg>
              Dashboard
            </Link>

            <Link href="/dashboard/register-patient" className="db-nav-item">
              <svg className="db-nav-icon" viewBox="0 0 24 24" fill="none" strokeWidth="1.75">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <line x1="19" y1="8" x2="19" y2="14"/>
                <line x1="16" y1="11" x2="22" y2="11"/>
              </svg>
              Register Patient
            </Link>

            <Link href="/dashboard/search" className="db-nav-item">
              <svg className="db-nav-icon" viewBox="0 0 24 24" fill="none" strokeWidth="1.75">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
              Biometric Search
            </Link>

            <div className="db-nav-divider"/>

            <Link href="/dashboard/emergency" className="db-nav-item emergency">
              <svg className="db-nav-icon" viewBox="0 0 24 24" fill="none" strokeWidth="1.75">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
              Emergency Access
            </Link>
          </nav>

          <div className="db-sidebar-footer">
            <button className="db-logout" onClick={handleLogout}>
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
        <main className="db-main">

          {/* Welcome */}
          <div className="db-welcome db-anim db-d1">
            <div className="db-eyebrow">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
              Verified Session
            </div>
            <h1 className="db-title">
              Good morning, <em>Dr. {doctorName}</em>
            </h1>
            <p className="db-subtitle">What would you like to do today?</p>
          </div>

          {/* Standard actions */}
          <p className="db-section-label db-anim db-d1">Quick Actions</p>
          <div className="db-cards">

            <Link href="/dashboard/register-patient" className="db-card db-anim db-d2">
              <div className="db-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <line x1="19" y1="8" x2="19" y2="14"/>
                  <line x1="16" y1="11" x2="22" y2="11"/>
                </svg>
              </div>
              <div>
                <p className="db-card-title">Register New Patient</p>
                <p className="db-card-desc">Enroll a patient and generate their biometric identity token.</p>
              </div>
              <div className="db-card-arrow">
                Get started
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </Link>

            <Link href="/dashboard/search" className="db-card db-anim db-d3">
              <div className="db-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35"/>
                </svg>
              </div>
              <div>
                <p className="db-card-title">Biometric Search</p>
                <p className="db-card-desc">Retrieve a patient record securely using their biometric token.</p>
              </div>
              <div className="db-card-arrow">
                Search now
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </Link>

            {/* Emergency — full width, visually separated */}
            <p className="db-section-label db-anim db-d3" style={{gridColumn:"1/-1", marginTop:12}}>Emergency</p>
            <Link href="/dashboard/emergency" className="db-card db-card-emergency db-anim db-d4">
              <div className="db-card-icon emergency">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
              </div>
              <div className="db-card-body">
                <p className="db-card-title">Emergency Access</p>
                <p className="db-card-desc">Generate a one-time biometric QR for immediate access to a patient's critical record.</p>
              </div>
              <div className="db-card-arrow">
                Open emergency access
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </Link>

          </div>

        </main>
      </div>
    </>
  );
}