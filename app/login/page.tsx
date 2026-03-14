"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      router.push("/dashboard");
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

        .lp-page {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #f9fafb;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .lp-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 20px;
          padding: 40px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.06);
          animation: lp-fade-up 0.45s ease both;
        }

        .lp-logo {
          font-family: 'Lora', serif;
          font-size: 1.25rem;
          font-weight: 600;
          color: #064e3b;
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          margin-bottom: 32px;
        }
        .lp-logo-dot {
          width: 8px; height: 8px;
          background: #10b981;
          border-radius: 50%;
        }

        .lp-eyebrow {
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
          margin-bottom: 16px;
        }

        .lp-title {
          font-family: 'Lora', serif;
          font-size: 1.75rem;
          font-weight: 600;
          color: #064e3b;
          line-height: 1.2;
          margin-bottom: 6px;
          letter-spacing: -0.02em;
        }

        .lp-desc {
          font-size: 0.875rem;
          color: #6b7280;
          font-weight: 300;
          margin-bottom: 28px;
          line-height: 1.6;
        }

        .lp-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 14px;
        }

        .lp-label {
          font-size: 0.78rem;
          font-weight: 600;
          color: #374151;
        }

        .lp-input {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          color: #111827;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 11px 14px;
          width: 100%;
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
        }
        .lp-input::placeholder { color: #9ca3af; }
        .lp-input:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16,185,129,0.10);
        }

        .lp-forgot {
          font-size: 0.75rem;
          color: #10b981;
          text-decoration: none;
          font-weight: 500;
          text-align: right;
          display: block;
          margin-top: 2px;
        }
        .lp-forgot:hover { text-decoration: underline; }

        .lp-btn {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          color: white;
          background: #10b981;
          border: none;
          border-radius: 10px;
          padding: 13px;
          cursor: pointer;
          width: 100%;
          margin-top: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
          box-shadow: 0 1px 3px rgba(16,185,129,0.25);
        }
        .lp-btn:hover:not(:disabled) {
          background: #059669;
          box-shadow: 0 4px 14px rgba(16,185,129,0.3);
          transform: translateY(-1px);
        }
        .lp-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        .lp-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 24px 0 0;
        }
        .lp-divider-line { flex: 1; height: 1px; background: #f3f4f6; }
        .lp-divider-text { font-size: 0.7rem; color: #d1d5db; white-space: nowrap; }

        .lp-trust {
          text-align: center;
          font-size: 0.7rem;
          color: #9ca3af;
          margin-top: 20px;
        }

        @keyframes lp-fade-up {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes spin { to { transform: rotate(360deg); } }
        .lp-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
      `}</style>

      <div className="lp-page">
        <div className="lp-card">

          <a href="/" className="lp-logo">
            <span className="lp-logo-dot"/>
            MedChain+
          </a>

          <div className="lp-eyebrow">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Doctor Portal
          </div>

          <h1 className="lp-title">Welcome back</h1>
          <p className="lp-desc">Sign in to access your patients' records.</p>

          <form onSubmit={handleLogin}>

            <div className="lp-field">
              <label className="lp-label" htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                placeholder="doctor@hospital.com"
                required
                className="lp-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="lp-field">
              <label className="lp-label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••••"
                required
                className="lp-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <a href="#" className="lp-forgot">Forgot password?</a>
            </div>

            <button type="submit" className="lp-btn" disabled={loading}>
              {loading ? <span className="lp-spinner"/> : (
                <>
                  Sign in
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </>
              )}
            </button>

          </form>

          <div className="lp-divider">
            <div className="lp-divider-line"/>
            <span className="lp-divider-text">Secured by MedChain+</span>
            <div className="lp-divider-line"/>
          </div>

          {/* <p className="lp-trust">End-to-end encrypted · Biometric verified · HIPAA compliant</p> */}

        </div>
      </div>
    </>
  );
}