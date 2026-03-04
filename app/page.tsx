import Link from "next/link";
import React from "react";

/* ─── HERO VISUAL ───────────────────────────────────────────────────────── */
function HeroVisual() {
  const FP = "M4.925.827A7.583 7.583 0 0115.66 9.316a.75.75 0 11-1.463-.333 6.083 6.083 0 00-8.61-6.81.75.75 0 01-.662-1.346zM3.278 2.903a.75.75 0 01.143 1.05 6.058 6.058 0 00-1.087 2.332 26.684 26.684 0 01-.811 2.9.75.75 0 11-1.416-.495c.262-.747.514-1.634.765-2.737a7.558 7.558 0 011.355-2.907.75.75 0 011.05-.143zm.259 3.656a4.85 4.85 0 019.176-.859.75.75 0 01-1.375.6A3.35 3.35 0 005 6.891c-.174.766-.354 1.46-.543 2.098a.75.75 0 01-1.438-.426c.179-.603.35-1.265.519-2.005zm3.548-.682a2.117 2.117 0 013.244 2.226 38.526 38.526 0 01-.684 2.614.75.75 0 11-1.436-.434c.235-.777.452-1.608.658-2.512a.617.617 0 00-.945-.649.75.75 0 01-.837-1.245zm5.345 1.935a.75.75 0 01.565.897c-.57 2.505-1.25 4.627-2.178 6.609a.75.75 0 01-1.358-.636c.871-1.86 1.52-3.874 2.073-6.305a.75.75 0 01.898-.565zm-5.768.673a.75.75 0 01.518.926c-.531 1.874-1.146 3.384-1.93 4.794-.057.103-.115.205-.174.307a.75.75 0 01-1.298-.75c.054-.095.108-.19.16-.285.72-1.296 1.295-2.696 1.798-4.475a.75.75 0 01.926-.517zm-3.487 1.998a.75.75 0 01.384.988c-.218.497-.45.96-.698 1.407a.75.75 0 01-1.311-.728c.226-.407.437-.83.637-1.283a.75.75 0 01.988-.385zm11.361.295a.75.75 0 01.516.927 34.364 34.364 0 01-.833 2.556.75.75 0 11-1.406-.522c.291-.785.554-1.596.796-2.445a.75.75 0 01.927-.516zm-6.21 1.53c.381.16.561.6.401.982a22.529 22.529 0 01-1.088 2.243.75.75 0 11-1.31-.729 21.03 21.03 0 001.015-2.094.75.75 0 01.981-.402z";

  const card: React.CSSProperties = {
    background: "white", border: "1px solid #eeeff2",
    borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
    padding: "10px 12px", position: "absolute",
  };
  const row: React.CSSProperties = {
    height: 6, borderRadius: 3, background: "#e5e7eb", marginTop: 5,
  };
  const rowDark: React.CSSProperties = { ...row, background: "#d1d5db" };

  return (
    <>
      <style>{`
        @keyframes hv-up   { 0%,100%{transform:translateY(0)}  50%{transform:translateY(-8px)} }
        @keyframes hv-down { 0%,100%{transform:translateY(0)}  50%{transform:translateY(8px)}  }
        .hv-up   { animation: hv-up   4s ease-in-out infinite }
        .hv-down { animation: hv-down 4.6s ease-in-out infinite }
        .hv-up2  { animation: hv-up   5.2s ease-in-out infinite }
        .hv-down2{ animation: hv-down 3.8s ease-in-out infinite }
      `}</style>

      {/* ── OUTER CONTAINER: fixed aspect ratio, relative ── */}
      <div style={{ position:"relative", width:"100%", maxWidth:500, margin:"0 auto", aspectRatio:"1/1" }}>

        {/* ── ORBIT RING (decorative) ── */}
        <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", zIndex:0 }}
          viewBox="0 0 500 500" fill="none">
          <defs>
            <radialGradient id="hvbg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.10"/>
              <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
            </radialGradient>
          </defs>
          <circle cx="250" cy="250" r="220" fill="url(#hvbg)"/>
          <circle cx="250" cy="250" r="178" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="5 12"/>
        </svg>

        {/* ══════════════════════════════════
            CENTER — SHIELD + FINGERPRINT
        ══════════════════════════════════ */}
        <div style={{
          position:"absolute", top:"50%", left:"50%",
          transform:"translate(-50%, -50%)",
          width:200, zIndex:2,
        }}>
          <svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%"}}>
            <defs>
              <radialGradient id="hvsg" cx="50%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#f0fdf9"/>
                <stop offset="100%" stopColor="#d1fae5"/>
              </radialGradient>
              <radialGradient id="hvfg" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.20"/>
                <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
              </radialGradient>
              <clipPath id="hvsc">
                <path d="M100 4 L186 42 L186 116 C186 168 100 196 100 196 C100 196 14 168 14 116 L14 42 Z"/>
              </clipPath>
              <filter id="hvss">
                <feDropShadow dx="0" dy="8" stdDeviation="18" floodColor="#10b98122"/>
              </filter>
            </defs>
            {/* Shield */}
            <path d="M100 4 L186 42 L186 116 C186 168 100 196 100 196 C100 196 14 168 14 116 L14 42 Z"
              fill="url(#hvsg)" stroke="#a7f3d0" strokeWidth="2" filter="url(#hvss)"/>
            {/* Inner border */}
            <path d="M100 20 L170 53 L170 114 C170 158 100 182 100 182 C100 182 30 158 30 114 L30 53 Z"
              fill="none" stroke="#d1fae5" strokeWidth="1"/>
            {/* FP glow */}
            <circle cx="100" cy="98" r="72" fill="url(#hvfg)" clipPath="url(#hvsc)"/>
            {/* Fingerprint */}
            <g clipPath="url(#hvsc)">
              <g transform="translate(43, 34) scale(7.1)">
                <path fill="#10b981" fillRule="evenodd" d={FP} clipRule="evenodd"/>
              </g>
            </g>
            {/* Verified pill */}
            <rect x="62" y="204" width="76" height="26" rx="13" fill="#10b981"/>
            <circle cx="80" cy="217" r="8" fill="#059669"/>
            <path d="M77 217 L80 220 L85 214" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="93" y="213" width="36" height="5" rx="2.5" fill="white" opacity="0.95"/>
            <rect x="93" y="220" width="24" height="3.5" rx="1.75" fill="white" opacity="0.5"/>
          </svg>
        </div>

        {/* ══════════════════════════════════
            ORBITING ELEMENTS
        ══════════════════════════════════ */}

        {/* ── TOP CENTER: Patient Record Card ── */}
        <div className="hv-up" style={{ ...card, top:"2%", left:"50%", transform:"translateX(-50%)", width:160, zIndex:3 }}>
          {/* header */}
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:"#f87171", flexShrink:0 }}/>
            <div style={{ height:6, borderRadius:3, background:"#d1d5db", flex:1 }}/>
            <div style={{ width:14, height:14, borderRadius:"50%", background:"#10b981", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M2 5 L4 7 L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>
          <div style={{ ...rowDark, width:"90%" }}/>
          <div style={{ ...row, width:"70%" }}/>
          <div style={{ ...row, width:"80%" }}/>
          <div style={{ display:"flex", gap:4, marginTop:8 }}>
            <div style={{ height:14, borderRadius:7, background:"#fee2e2", flex:2 }}/>
            <div style={{ height:14, borderRadius:7, background:"#ecfdf5", flex:2 }}/>
            <div style={{ height:14, borderRadius:7, background:"#eff6ff", flex:2 }}/>
          </div>
        </div>

        {/* ── TOP RIGHT: Lock ── */}
        <div className="hv-down" style={{ ...card, top:"14%", right:"4%", width:58, height:58, padding:0, display:"flex", alignItems:"center", justifyContent:"center", zIndex:3 }}>
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <rect x="7" y="14" width="16" height="13" rx="3" fill="#f1f5f9"/>
            <path d="M10 14 V10 A5 5 0 0 1 20 10 V14" stroke="#10b981" strokeWidth="2" fill="none" strokeLinecap="round"/>
            <circle cx="15" cy="20" r="2.5" fill="#10b981"/>
            <rect x="13.5" y="20" width="3" height="4" rx="1.5" fill="#10b981"/>
          </svg>
        </div>

        {/* ── RIGHT: Audit Log ── */}
        <div className="hv-up2" style={{ ...card, top:"50%", right:"0%", transform:"translateY(-50%)", width:130, zIndex:3 }}>
          <div style={{ height:5, borderRadius:2.5, background:"#d1fae5", width:"60%", marginBottom:8 }}/>
          {[1,0.5,1,0.7].map((o,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:5, marginTop:i>0?6:0 }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:"#10b981", opacity:o, flexShrink:0 }}/>
              <div style={{ height:5, borderRadius:2.5, background:"#e5e7eb", flex:1 }}/>
            </div>
          ))}
        </div>

        {/* ── BOTTOM RIGHT: Prescription Card ── */}
        <div className="hv-down2" style={{ ...card, bottom:"4%", right:"4%", width:148, zIndex:3 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
            <span style={{ fontFamily:"Georgia,serif", fontSize:13, fontWeight:700, color:"#94a3b8", lineHeight:1 }}>Rx</span>
            <div style={{ height:5, borderRadius:2.5, background:"#d1d5db", flex:1 }}/>
          </div>
          <div style={{ display:"flex", alignItems:"flex-start", gap:7, marginTop:6 }}>
            <div style={{ width:10, height:10, borderRadius:2, background:"#dbeafe", flexShrink:0, marginTop:2 }}/>
            <div style={{ flex:1 }}>
              <div style={{ ...rowDark, width:"90%" }}/>
              <div style={{ ...row, width:"70%", marginTop:4 }}/>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"flex-start", gap:7, marginTop:8 }}>
            <div style={{ width:10, height:10, borderRadius:2, background:"#ede9fe", flexShrink:0, marginTop:2 }}/>
            <div style={{ flex:1 }}>
              <div style={{ ...rowDark, width:"80%" }}/>
              <div style={{ ...row, width:"60%", marginTop:4 }}/>
            </div>
          </div>
        </div>

        {/* ── BOTTOM LEFT: Shield Check ── */}
        <div className="hv-down" style={{ ...card, bottom:"14%", left:"4%", width:58, height:58, padding:0, display:"flex", alignItems:"center", justifyContent:"center", zIndex:3 }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M16 3 L28 8.5 V17 C28 24.5 16 29 16 29 C16 29 4 24.5 4 17 V8.5 Z"
              fill="#f0fdf9" stroke="#a7f3d0" strokeWidth="1.5"/>
            <path d="M11 16.5 L14.5 20 L21 13" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* ── LEFT: Audit Log ── */}
        <div className="hv-up" style={{ ...card, top:"50%", left:"0%", transform:"translateY(-50%)", width:118, zIndex:3 }}>
          <div style={{ height:5, borderRadius:2.5, background:"#d1fae5", width:"55%", marginBottom:8 }}/>
          {[0.4,1,0.6,0.8].map((o,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:5, marginTop:i>0?6:0 }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:"#10b981", opacity:o, flexShrink:0 }}/>
              <div style={{ height:5, borderRadius:2.5, background:"#e5e7eb", flex:1 }}/>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}



/* ─── FEATURE CARD ─────────────────────────────────────────────────────── */
function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="mc-feature-card">
      <div style={{
        width: 44, height: 44, borderRadius: 10,
        background: "#f0fdf9", border: "1px solid #d1fae5",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#10b981",
      }}>
        {icon}
      </div>
      <p style={{ fontWeight: 600, fontSize: "0.95rem", color: "#111827", margin: 0 }}>{title}</p>
      <p style={{ fontSize: "0.83rem", color: "#6b7280", lineHeight: 1.65, margin: 0 }}>{desc}</p>
    </div>
  );
}

/* ─── PAGE ──────────────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; }

        .mc-page {
          font-family: 'DM Sans', sans-serif;
          background: #ffffff;
          color: #111827;
          min-height: 100vh;
        }

        .mc-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 64px;
          border-bottom: 1px solid #f3f4f6;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(12px);
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .mc-logo {
          font-family: 'Lora', serif;
          font-size: 1.35rem;
          font-weight: 600;
          color: #064e3b;
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
        }

        .mc-logo-dot {
          width: 8px; height: 8px;
          background: #10b981;
          border-radius: 50%;
        }

        .mc-nav-links {
          display: flex; gap: 36px; list-style: none; margin: 0; padding: 0;
        }
        .mc-nav-links a {
          font-size: 0.875rem; font-weight: 400;
          color: #6b7280; text-decoration: none;
          transition: color 0.18s;
        }
        .mc-nav-links a:hover { color: #111827; }

        .mc-btn {
          display: inline-flex; align-items: center; gap: 7px;
          background: #10b981; color: white;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem; font-weight: 600;
          padding: 10px 22px; border-radius: 10px;
          text-decoration: none;
          transition: background 0.2s, box-shadow 0.2s;
          box-shadow: 0 1px 3px rgba(16,185,129,0.25);
        }
        .mc-btn:hover {
          background: #059669;
          box-shadow: 0 4px 14px rgba(16,185,129,0.3);
        }

        .mc-btn-outline {
          display: inline-flex; align-items: center; gap: 7px;
          background: transparent; color: #374151;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem; font-weight: 500;
          padding: 10px 22px; border-radius: 10px;
          border: 1px solid #e5e7eb;
          text-decoration: none;
          transition: border-color 0.2s, color 0.2s;
        }
        .mc-btn-outline:hover { border-color: #10b981; color: #10b981; }

        .mc-hero {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: center;
          padding: 80px 64px 96px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .mc-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          background: #f0fdf9; color: #065f46;
          font-size: 0.75rem; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          padding: 6px 14px; border-radius: 100px;
          border: 1px solid #d1fae5;
          margin-bottom: 24px;
        }

        .mc-h1 {
          font-family: 'Lora', serif;
          font-size: clamp(2.4rem, 3.8vw, 3.5rem);
          font-weight: 600;
          line-height: 1.12;
          color: #064e3b;
          margin: 0 0 20px;
          letter-spacing: -0.02em;
        }

        .mc-h1 em {
          font-style: italic;
          color: #10b981;
        }

        .mc-body-text {
          font-size: 1rem;
          color: #6b7280;
          line-height: 1.75;
          max-width: 440px;
          margin: 0 0 36px;
          font-weight: 300;
        }

        .mc-ctas {
          display: flex; gap: 12px; flex-wrap: wrap; align-items: center;
        }

        .mc-features-section {
          background: #f9fafb;
          border-top: 1px solid #f3f4f6;
          border-bottom: 1px solid #f3f4f6;
          padding: 80px 64px;
        }

        .mc-features-inner {
          max-width: 1200px; margin: 0 auto;
        }

        .mc-section-label {
          text-align: center;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #10b981;
          margin-bottom: 12px;
        }

        .mc-section-title {
          font-family: 'Lora', serif;
          text-align: center;
          font-size: 2rem;
          font-weight: 600;
          color: #064e3b;
          margin: 0 auto 48px;
          max-width: 480px;
          line-height: 1.25;
        }

        .mc-features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .mc-feature-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 28px 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: box-shadow 0.2s, border-color 0.2s;
        }

        .mc-feature-card:hover {
          box-shadow: 0 8px 32px rgba(16,185,129,0.10);
          border-color: #a7f3d0;
        }

        .mc-trust {
          padding: 44px 64px;
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        .mc-trust-label {
          font-size: 0.78rem;
          font-weight: 500;
          color: #9ca3af;
          white-space: nowrap;
        }

        .mc-trust-divider {
          flex: 1;
          height: 1px;
          background: #f3f4f6;
        }

        .mc-trust-items {
          display: flex; gap: 32px; flex-wrap: wrap;
        }

        .mc-trust-item {
          font-size: 0.82rem;
          color: #9ca3af;
          font-weight: 400;
        }

        @keyframes fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .anim { animation: fade-up 0.6s ease both; }
        .d1 { animation-delay: 0.05s; }
        .d2 { animation-delay: 0.15s; }
        .d3 { animation-delay: 0.25s; }
        .d4 { animation-delay: 0.35s; }

        @media (max-width: 768px) {
          .mc-nav { padding: 16px 24px; }
          .mc-nav-links { display: none; }
          .mc-hero { grid-template-columns: 1fr; padding: 48px 24px; }
          .mc-features-section { padding: 60px 24px; }
          .mc-features-grid { grid-template-columns: 1fr; }
          .mc-trust { flex-direction: column; padding: 32px 24px; }
        }
      `}</style>

      <div className="mc-page">

        {/* ── NAV ── */}
        <nav className="mc-nav">
          <a href="/" className="mc-logo">
            <span className="mc-logo-dot" />
            MedChain+
          </a>

          <ul className="mc-nav-links">
            <li><a href="#">Platform</a></li>
            <li><a href="#">Security</a></li>
            <li><a href="#">Hospitals</a></li>
            <li><a href="#">Support</a></li>
          </ul>

          <Link href="/login" className="mc-btn">
            Doctor Login
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </nav>

        {/* ── HERO ── */}
        <section className="mc-hero">

          {/* Left */}
          <div>
            <div className="mc-eyebrow anim d1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
              Secure Biometric Infrastructure
            </div>

            <h1 className="mc-h1 anim d2">
              Hospital Records,<br />
              Secured with<br />
              <em>Biometric Identity.</em>
            </h1>

            <p className="mc-body-text anim d3">
              MedChain+ brings structured, verifiable patient record management
              to hospital-scale infrastructure — through biometric verification,
              relational architecture, and transparent audit logging.
            </p>

            <div className="mc-ctas anim d4">
              <Link href="/login" className="mc-btn">
                Access Doctor Portal
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <a href="#" className="mc-btn-outline">Learn more</a>
            </div>
          </div>

          {/* Right — visual */}
          <div className="anim d3">
            <HeroVisual />
          </div>


        </section>

        {/* ── FEATURES ── */}
        <section className="mc-features-section">
          <div className="mc-features-inner">
            <p className="mc-section-label">Core Capabilities</p>
            <h2 className="mc-section-title">Everything your hospital needs to secure patient data</h2>

            <div className="mc-features-grid">

              <FeatureCard
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                    <path d="M8 12c0-2.21 1.79-4 4-4s4 1.79 4 4"/>
                    <path d="M10 15c0-1.1.9-2 2-2s2 .9 2 2"/>
                    <circle cx="12" cy="18" r="1"/>
                  </svg>
                }
                title="Biometric Verification"
                desc="Fingerprint and identity-linked access ensures every patient record interaction is tied to a verified clinical identity."
              />

              <FeatureCard
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <rect x="3" y="11" width="18" height="11" rx="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    <circle cx="12" cy="16" r="1.5" fill="currentColor"/>
                  </svg>
                }
                title="Immutable Audit Logs"
                desc="Every access event, record change, and permission update is logged with cryptographic integrity for full compliance traceability."
              />

              <FeatureCard
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path d="M12 3 L21 7 V12 C21 16.97 17.03 21.45 12 22 C6.97 21.45 3 16.97 3 12 V7 Z"/>
                    <path d="M9 12l2 2 4-4"/>
                  </svg>
                }
                title="QR-Based Patient Identity"
                desc="Patients are issued secure QR identifiers for fast, contactless lookup — removing friction while keeping access controlled."
              />

              <FeatureCard
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <rect x="2" y="3" width="20" height="14" rx="2"/>
                    <path d="M8 21h8M12 17v4"/>
                  </svg>
                }
                title="Relational Record Architecture"
                desc="Patient records, departments, and clinical staff are connected in a structured relational model built for hospital complexity."
              />

              <FeatureCard
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                }
                title="Role-Based Access Control"
                desc="Granular permissions for doctors, nurses, and admins — ensuring each user only accesses what they are authorized to see."
              />

              <FeatureCard
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                  </svg>
                }
                title="Real-Time Activity Monitoring"
                desc="Hospital administrators get a live view of record access activity, flagged anomalies, and department-level usage insights."
              />

            </div>
          </div>
        </section>

        {/* ── TRUST BAR ── */}
        <div className="mc-trust">
          <span className="mc-trust-label">Designed for</span>
          <div className="mc-trust-divider" />
          <div className="mc-trust-items">
            <span className="mc-trust-item">Regional Hospitals</span>
            <span className="mc-trust-item">Emergency Units</span>
            <span className="mc-trust-item">Specialty Clinics</span>
            <span className="mc-trust-item">Research Institutions</span>
            <span className="mc-trust-item">Surgical Centers</span>
          </div>
        </div>

      </div>
    </>
  );
}