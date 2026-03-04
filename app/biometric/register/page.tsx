"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { startRegistration } from "@simplewebauthn/browser";

type Stage = "loading" | "scanning" | "verifying" | "success" | "error";

export default function BiometricRegisterPage() {
  const searchParams = useSearchParams();
  const session = searchParams.get("session");
  const hasStarted = useRef(false);

  const [stage, setStage] = useState<Stage>("loading");
  const [message, setMessage] = useState("Preparing biometric registration…");

  useEffect(() => {
    if (!session) { setStage("error"); setMessage("Invalid or missing registration link."); return; }
    if (hasStarted.current) return;
    hasStarted.current = true;

    async function register() {
      try {
        setStage("loading");
        setMessage("Loading session…");

        const res = await fetch(`/api/biometric/register/options?session=${session}`, { cache: "no-store" });
        const options = await res.json();
        if (!res.ok) { setStage("error"); setMessage(options.error || "Session invalid or expired."); return; }

        setStage("scanning");
        setMessage("Follow the prompt to scan your fingerprint or face…");

        const credential = await startRegistration(options);

        setStage("verifying");
        setMessage("Verifying your biometric…");

        const verifyRes = await fetch("/api/biometric/register/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session, credential }),
        });
        const verifyData = await verifyRes.json();

        if (!verifyRes.ok) { setStage("error"); setMessage(verifyData.error || "Verification failed."); return; }

        setStage("success");
        setMessage("Your biometric has been registered successfully.");

      } catch (err: any) {
        setStage("error");
        setMessage(err?.message || "Biometric registration failed.");
      }
    }

    register();
  }, [session]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .br-page {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          min-height: 100dvh;
          background: #f9fafb;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px 20px;
        }

        .br-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 24px;
          padding: 40px 28px 36px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.06);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          animation: br-fade-up 0.4s ease both;
        }

        /* ── LOGO ── */
        .br-logo {
          font-family: 'Lora', serif;
          font-size: 1.1rem;
          font-weight: 600;
          color: #064e3b;
          display: flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 36px;
        }
        .br-logo-dot { width: 7px; height: 7px; background: #10b981; border-radius: 50%; }

        /* ── ICON AREA ── */
        .br-icon-wrap {
          width: 80px; height: 80px;
          border-radius: 22px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 24px;
          transition: background 0.3s, border-color 0.3s;
        }
        .br-icon-wrap.loading  { background: #f9fafb; border: 1px solid #e5e7eb; }
        .br-icon-wrap.scanning { background: #f0fdf9; border: 1px solid #d1fae5; }
        .br-icon-wrap.verifying{ background: #eff6ff; border: 1px solid #bfdbfe; }
        .br-icon-wrap.success  { background: #f0fdf9; border: 1px solid #d1fae5; }
        .br-icon-wrap.error    { background: #fef2f2; border: 1px solid #fecaca; }

        /* ── TEXT ── */
        .br-title {
          font-family: 'Lora', serif;
          font-size: 1.3rem;
          font-weight: 600;
          color: #064e3b;
          line-height: 1.3;
          margin-bottom: 10px;
          letter-spacing: -0.01em;
        }
        .br-title.error { color: #991b1b; }

        .br-message {
          font-size: 0.9rem;
          color: #6b7280;
          font-weight: 300;
          line-height: 1.65;
          max-width: 280px;
        }

        /* ── STATUS BADGE ── */
        .br-badge {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 6px 14px; border-radius: 100px;
          font-size: 0.72rem; font-weight: 600;
          margin-top: 24px;
        }
        .br-badge.loading  { background: #f9fafb; color: #6b7280; border: 1px solid #e5e7eb; }
        .br-badge.scanning { background: #f0fdf9; color: #065f46; border: 1px solid #d1fae5; }
        .br-badge.verifying{ background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
        .br-badge.success  { background: #f0fdf9; color: #065f46; border: 1px solid #d1fae5; }
        .br-badge.error    { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }

        /* ── ANIMATIONS ── */
        @keyframes br-spin   { to { transform: rotate(360deg); } }
        @keyframes br-pulse  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.88)} }
        @keyframes br-fade-up{ from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }

        .br-spin  { animation: br-spin  1s linear infinite; }
        .br-pulse { animation: br-pulse 1.6s ease-in-out infinite; }

        .br-footer {
          margin-top: 40px;
          font-size: 0.7rem;
          color: #9ca3af;
          text-align: center;
          line-height: 1.6;
        }
      `}</style>

      <div className="br-page">
        <div className="br-card">

          {/* Logo */}
          <div className="br-logo">
            <span className="br-logo-dot"/>
            MedChain+
          </div>

          {/* Icon */}
          <div className={`br-icon-wrap ${stage}`}>
            {stage === "loading" && (
              <svg className="br-spin" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
            )}
            {stage === "scanning" && (
              <svg className="br-pulse" width="36" height="36" viewBox="0 0 16 16" fill="#10b981">
                <path fillRule="evenodd" clipRule="evenodd"
                  d="M4.925.827A7.583 7.583 0 0115.66 9.316a.75.75 0 11-1.463-.333 6.083 6.083 0 00-8.61-6.81.75.75 0 01-.662-1.346zM3.278 2.903a.75.75 0 01.143 1.05 6.058 6.058 0 00-1.087 2.332 26.684 26.684 0 01-.811 2.9.75.75 0 11-1.416-.495c.262-.747.514-1.634.765-2.737a7.558 7.558 0 011.355-2.907.75.75 0 011.05-.143zm.259 3.656a4.85 4.85 0 019.176-.859.75.75 0 01-1.375.6A3.35 3.35 0 005 6.891c-.174.766-.354 1.46-.543 2.098a.75.75 0 01-1.438-.426c.179-.603.35-1.265.519-2.005zm3.548-.682a2.117 2.117 0 013.244 2.226 38.526 38.526 0 01-.684 2.614.75.75 0 11-1.436-.434c.235-.777.452-1.608.658-2.512a.617.617 0 00-.945-.649.75.75 0 01-.837-1.245zm5.345 1.935a.75.75 0 01.565.897c-.57 2.505-1.25 4.627-2.178 6.609a.75.75 0 01-1.358-.636c.871-1.86 1.52-3.874 2.073-6.305a.75.75 0 01.898-.565zm-5.768.673a.75.75 0 01.518.926c-.531 1.874-1.146 3.384-1.93 4.794-.057.103-.115.205-.174.307a.75.75 0 01-1.298-.75c.054-.095.108-.19.16-.285.72-1.296 1.295-2.696 1.798-4.475a.75.75 0 01.926-.517zm-3.487 1.998a.75.75 0 01.384.988c-.218.497-.45.96-.698 1.407a.75.75 0 01-1.311-.728c.226-.407.437-.83.637-1.283a.75.75 0 01.988-.385zm11.361.295a.75.75 0 01.516.927 34.364 34.364 0 01-.833 2.556.75.75 0 11-1.406-.522c.291-.785.554-1.596.796-2.445a.75.75 0 01.927-.516zm-6.21 1.53c.381.16.561.6.401.982a22.529 22.529 0 01-1.088 2.243.75.75 0 11-1.31-.729 21.03 21.03 0 001.015-2.094.75.75 0 01.981-.402z"/>
              </svg>
            )}
            {stage === "verifying" && (
              <svg className="br-spin" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
            )}
            {stage === "success" && (
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
            )}
            {stage === "error" && (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            )}
          </div>

          {/* Title */}
          <h1 className={`br-title ${stage === "error" ? "error" : ""}`}>
            {stage === "loading"   && "Preparing…"}
            {stage === "scanning"  && "Scan your biometric"}
            {stage === "verifying" && "Verifying…"}
            {stage === "success"   && "Registration complete"}
            {stage === "error"     && "Something went wrong"}
          </h1>

          {/* Message */}
          <p className="br-message">{message}</p>

          {/* Status badge */}
          <div className={`br-badge ${stage}`}>
            {stage === "loading"   && "• Loading session"}
            {stage === "scanning"  && "• Waiting for scan"}
            {stage === "verifying" && "• Verifying with server"}
            {stage === "success"   && "✓ Biometric saved"}
            {stage === "error"     && "✕ Registration failed"}
          </div>

        </div>

        {/* Footer */}
        <p className="br-footer">
          Secured by MedChain+ · End-to-end encrypted
        </p>
      </div>
    </>
  );
}