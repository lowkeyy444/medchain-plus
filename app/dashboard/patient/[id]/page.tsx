"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import QRCode from "qrcode";

export default function PatientProfile() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [patient, setPatient] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [accessLogs, setAccessLogs] = useState<any[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [savingRecord, setSavingRecord] = useState(false);

  const [visitType, setVisitType] = useState("");
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [vitals, setVitals] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");
  const [investigations, setInvestigations] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => { loadPatient(); }, [id]);

  async function loadPatient() {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    const res = await fetch(`/api/patients/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (!res.ok) { alert(data.error || "Failed to load patient"); return; }
    setPatient(data);
    setRecords(data.medicalRecords || []);
    setAccessLogs(data.accessLogs || []);
  }

  async function handleCreateRecord(e: React.FormEvent) {
    e.preventDefault();
    setSavingRecord(true);
    const token = localStorage.getItem("token");
    const res = await fetch("/api/medical-records", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ patientId: patient.id, visitType, chiefComplaint, vitals, diagnosis, prescription, investigations, followUpDate, notes }),
    });
    const data = await res.json();
    if (res.ok) {
      setRecords((prev) => [data, ...prev]);
      setShowForm(false);
      setVisitType(""); setChiefComplaint(""); setVitals(""); setDiagnosis("");
      setPrescription(""); setInvestigations(""); setFollowUpDate(""); setNotes("");
    } else { alert(data.error); }
    setSavingRecord(false);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, recordId: number) {
    const file = e.target.files?.[0];
    if (!file) return;
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("medicalRecordId", String(recordId));
    const res = await fetch("/api/attachments/upload", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: formData });
    const data = await res.json();
    if (res.ok) {
      setRecords((prev) => prev.map((r) => r.id === recordId ? { ...r, attachments: [...(r.attachments || []), data] } : r));
    } else { alert(data.error); }
  }

  async function handleViewFile(filePath: string, recordId: number) {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/attachments/view", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ filePath, patientId: patient.id, recordId }),
    });
    const data = await res.json();
    if (res.ok) { window.open(data.url, "_blank"); } else { alert(data.error); }
  }

  async function handleRegisterBiometric() {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/biometric/register/session", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ patientId: patient.id }),
    });
    const options = await res.json();
    const url = window.location.origin + "/biometric/register?session=" + options.sessionId;
    const dataUrl = await QRCode.toDataURL(url);
    setQrCode(dataUrl);
  }

  if (!patient) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"DM Sans, sans-serif", color:"#6b7280" }}>
      Loading patient…
    </div>
  );

  const age = patient.dateOfBirth ? new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear() : null;

  const visitTypeColors: Record<string, string> = { OPD:"#ecfdf5", Emergency:"#fef2f2", "Follow-up":"#eff6ff" };
  const visitTypeText:   Record<string, string> = { OPD:"#065f46", Emergency:"#991b1b", "Follow-up":"#1d4ed8" };

  const actionLabel: Record<string, string> = {
    VIEW_PATIENT: "Viewed record",
    ADD_RECORD:   "Added record",
    UPLOAD_FILE:  "Uploaded file",
  };

  type MethodMeta = { bg: string; text: string; border: string; dot: string; label: string };
  const methodMeta: Record<string, MethodMeta> = {
    BIOMETRIC: { bg:"#f0fdf9", text:"#065f46", border:"#d1fae5", dot:"#10b981", label:"Biometric" },
    TOKEN:     { bg:"#eff6ff", text:"#1d4ed8", border:"#bfdbfe", dot:"#3b82f6", label:"Token"     },
    MANUAL:    { bg:"#f9fafb", text:"#6b7280", border:"#e5e7eb", dot:"#9ca3af", label:"Manual"    },
  };

  function relativeTime(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    const h = Math.floor(diff / 3600000);
    const d = Math.floor(diff / 86400000);
    if (m < 1)  return "just now";
    if (m < 60) return `${m}m ago`;
    if (h < 24) return `${h}h ago`;
    if (d < 7)  return `${d}d ago`;
    return new Date(dateStr).toLocaleDateString("en-US", { day:"numeric", month:"short" });
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .pp-layout { font-family:'DM Sans',sans-serif; min-height:100vh; display:flex; background:#f9fafb; color:#111827; }

        /* ── NAV SIDEBAR ── */
        .pp-sidebar { width:240px; flex-shrink:0; background:white; border-right:1px solid #f3f4f6; display:flex; flex-direction:column; padding:32px 24px; position:sticky; top:0; height:100vh; }
        .pp-logo { font-family:'Lora',serif; font-size:1.2rem; font-weight:600; color:#064e3b; display:flex; align-items:center; gap:8px; text-decoration:none; margin-bottom:40px; }
        .pp-logo-dot { width:8px; height:8px; background:#10b981; border-radius:50%; }
        .pp-nav { display:flex; flex-direction:column; gap:4px; flex:1; }
        .pp-nav-item { display:flex; align-items:center; gap:10px; font-size:0.875rem; font-weight:500; color:#6b7280; text-decoration:none; padding:9px 12px; border-radius:10px; transition:background 0.15s,color 0.15s; }
        .pp-nav-item:hover { background:#f3f4f6; color:#111827; }
        .pp-sidebar-footer { border-top:1px solid #f3f4f6; padding-top:20px; }
        .pp-logout { display:flex; align-items:center; gap:10px; font-size:0.875rem; font-weight:500; color:#9ca3af; background:none; border:none; cursor:pointer; padding:9px 12px; border-radius:10px; width:100%; transition:background 0.15s,color 0.15s; font-family:'DM Sans',sans-serif; }
        .pp-logout:hover { background:#fef2f2; color:#ef4444; }

        /* ── PAGE BODY ── */
        .pp-body { flex:1; padding:40px 40px 60px; overflow-y:auto; }

        /* ── TWO-COLUMN GRID ── */
        .pp-grid {
          display: grid;
          grid-template-columns: 1fr 300px;
          grid-template-rows: auto 1fr;
          gap: 20px;
          max-width: 1100px;
        }
        /* Patient header spans full width */
        .pp-header-card { grid-column: 1 / -1; }
        /* Left column: records */
        .pp-left-col { grid-column: 1; display:flex; flex-direction:column; gap:20px; min-width:0; }
        /* Right column: access log — sticky so it stays in view while scrolling records */
        .pp-right-col {
          grid-column: 2;
          grid-row: 2;
          position: sticky;
          top: 40px;
          align-self: start;
          max-height: calc(100vh - 80px);
          display: flex;
          flex-direction: column;
        }

        /* ── SHARED CARD ── */
        .pp-card { background:white; border:1px solid #e5e7eb; border-radius:20px; box-shadow:0 2px 12px rgba(0,0,0,0.04); }

        /* ── PATIENT HEADER ── */
        .pp-header-card { padding:26px 30px; }
        .pp-header-top { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; }
        .pp-avatar { width:50px; height:50px; border-radius:14px; background:#f0fdf9; border:1px solid #d1fae5; display:flex; align-items:center; justify-content:center; color:#10b981; flex-shrink:0; }
        .pp-patient-name { font-family:'Lora',serif; font-size:1.45rem; font-weight:600; color:#064e3b; margin-bottom:4px; }
        .pp-patient-meta { font-size:0.82rem; color:#6b7280; display:flex; gap:10px; flex-wrap:wrap; margin-bottom:10px; }
        .pp-meta-dot { color:#d1d5db; }
        .pp-tag { display:inline-flex; align-items:center; gap:5px; padding:4px 10px; border-radius:100px; font-size:0.7rem; font-weight:600; }
        .pp-tag-green { background:#ecfdf5; color:#065f46; border:1px solid #d1fae5; }
        .pp-tag-red   { background:#fef2f2; color:#991b1b; border:1px solid #fecaca; }
        .pp-tag-gray  { background:#f9fafb; color:#6b7280; border:1px solid #e5e7eb; }
        .pp-toggle-btn { font-size:0.8rem; font-weight:600; color:#10b981; background:none; border:none; cursor:pointer; white-space:nowrap; padding:6px 12px; border-radius:8px; transition:background 0.15s; font-family:'DM Sans',sans-serif; flex-shrink:0; }
        .pp-toggle-btn:hover { background:#f0fdf9; }
        .pp-details-grid { margin-top:22px; padding-top:18px; border-top:1px solid #f3f4f6; display:grid; grid-template-columns:repeat(3,1fr); gap:14px 20px; }
        .pp-detail-item { display:flex; flex-direction:column; gap:3px; }
        .pp-detail-label { font-size:0.68rem; font-weight:600; color:#9ca3af; letter-spacing:0.06em; text-transform:uppercase; }
        .pp-detail-value { font-size:0.85rem; color:#111827; }

        /* ── RECORDS CARD ── */
        .pp-records-card { padding:26px 28px; }
        .pp-records-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; }
        .pp-records-title { font-family:'Lora',serif; font-size:1.1rem; font-weight:600; color:#064e3b; }
        .pp-header-actions { display:flex; gap:8px; }
        .pp-btn { font-family:'DM Sans',sans-serif; font-size:0.78rem; font-weight:600; display:inline-flex; align-items:center; gap:6px; padding:7px 14px; border-radius:9px; cursor:pointer; border:none; transition:background 0.2s,box-shadow 0.2s,transform 0.15s; }
        .pp-btn-green { background:#10b981; color:white; box-shadow:0 1px 3px rgba(16,185,129,0.25); }
        .pp-btn-green:hover { background:#059669; box-shadow:0 4px 12px rgba(16,185,129,0.3); transform:translateY(-1px); }
        .pp-btn-outline { background:white; color:#374151; border:1px solid #e5e7eb; }
        .pp-btn-outline:hover { background:#f9fafb; border-color:#d1d5db; }

        /* QR */
        .pp-qr-box { background:#f9fafb; border:1px solid #e5e7eb; border-radius:14px; padding:20px; display:flex; flex-direction:column; align-items:center; gap:10px; margin-bottom:18px; text-align:center; }
        .pp-qr-label { font-size:0.78rem; color:#6b7280; }

        /* Form */
        .pp-form { background:#f9fafb; border:1px solid #e5e7eb; border-radius:14px; padding:20px; margin-bottom:18px; }
        .pp-form-title { font-size:0.85rem; font-weight:600; color:#111827; margin-bottom:16px; }
        .pp-form-grid { display:grid; gap:11px; }
        .pp-form-grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:11px; }
        .pp-field { display:flex; flex-direction:column; gap:4px; }
        .pp-label { font-size:0.7rem; font-weight:600; color:#374151; }
        .pp-input,.pp-select,.pp-textarea { font-family:'DM Sans',sans-serif; font-size:0.85rem; color:#111827; background:white; border:1px solid #e5e7eb; border-radius:9px; padding:8px 12px; width:100%; outline:none; transition:border-color 0.18s,box-shadow 0.18s; }
        .pp-input::placeholder,.pp-textarea::placeholder { color:#9ca3af; }
        .pp-input:focus,.pp-select:focus,.pp-textarea:focus { border-color:#10b981; box-shadow:0 0 0 3px rgba(16,185,129,0.10); }
        .pp-select { appearance:none; background-image:url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%239CA3AF' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 12px center; padding-right:32px; }
        .pp-textarea { resize:vertical; min-height:68px; line-height:1.5; }
        .pp-form-actions { display:flex; gap:8px; margin-top:14px; }

        /* Record cards */
        .pp-record { border:1px solid #f0f0f0; border-radius:14px; padding:18px 20px; margin-bottom:12px; background:white; transition:border-color 0.2s; }
        .pp-record:hover { border-color:#d1fae5; }
        .pp-record:last-child { margin-bottom:0; }
        .pp-record-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px; }
        .pp-record-hospital { font-size:0.85rem; font-weight:600; color:#111827; margin-bottom:2px; }
        .pp-record-doctor { font-size:0.76rem; color:#6b7280; }
        .pp-record-date { font-size:0.7rem; color:#9ca3af; white-space:nowrap; }
        .pp-record-fields { display:grid; grid-template-columns:1fr 1fr; gap:9px 20px; margin-bottom:14px; }
        .pp-record-field { display:flex; flex-direction:column; gap:2px; }
        .pp-record-field-label { font-size:0.66rem; font-weight:600; color:#9ca3af; letter-spacing:0.06em; text-transform:uppercase; }
        .pp-record-field-value { font-size:0.82rem; color:#374151; line-height:1.5; }

        /* Attachments */
        .pp-attachments { padding-top:12px; border-top:1px solid #f3f4f6; }
        .pp-attachments-label { font-size:0.68rem; font-weight:600; color:#9ca3af; letter-spacing:0.06em; text-transform:uppercase; margin-bottom:8px; }
        .pp-attach-row { display:flex; align-items:center; gap:8px; margin-bottom:5px; }
        .pp-attach-name { font-size:0.76rem; color:#6b7280; flex:1; }
        .pp-attach-view { font-size:0.73rem; font-weight:600; color:#10b981; background:none; border:none; cursor:pointer; padding:3px 7px; border-radius:6px; transition:background 0.15s; }
        .pp-attach-view:hover { background:#f0fdf9; }
        .pp-upload-label { display:inline-flex; align-items:center; gap:6px; font-size:0.73rem; font-weight:600; color:#374151; background:white; border:1px solid #e5e7eb; border-radius:8px; padding:5px 11px; cursor:pointer; transition:background 0.15s,border-color 0.15s; }
        .pp-upload-label:hover { background:#f9fafb; border-color:#d1d5db; }

        /* Empty state */
        .pp-empty { text-align:center; padding:36px 16px; color:#9ca3af; font-size:0.85rem; font-weight:300; }
        .pp-empty-icon { width:40px; height:40px; border-radius:11px; background:#f9fafb; border:1px solid #e5e7eb; display:flex; align-items:center; justify-content:center; margin:0 auto 10px; color:#d1d5db; }

        /* ── ACCESS LOG CARD ── */
        .pp-log-card {
          padding: 22px 20px 0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .pp-log-card-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 16px; flex-shrink: 0;
        }
        .pp-log-card-title {
          font-family: 'Lora', serif; font-size: 0.95rem; font-weight: 600; color: #064e3b;
          display: flex; align-items: center; gap: 8px;
        }
        .pp-log-card-count {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.68rem; font-weight: 700;
          background: #f0fdf9; color: #065f46; border: 1px solid #d1fae5;
          border-radius: 100px; padding: 2px 8px;
        }
        .pp-log-scroll {
          overflow-y: auto;
          flex: 1;
          padding-bottom: 20px;
          /* subtle scroll */
          scrollbar-width: thin;
          scrollbar-color: #e5e7eb transparent;
        }
        .pp-log-scroll::-webkit-scrollbar { width: 4px; }
        .pp-log-scroll::-webkit-scrollbar-track { background: transparent; }
        .pp-log-scroll::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }

        /* Individual log entry */
        .pp-log-entry {
          display: flex; gap: 11px; align-items: flex-start;
          padding: 11px 0;
          border-bottom: 1px solid #f3f4f6;
        }
        .pp-log-entry:last-child { border-bottom: none; }

        .pp-log-dot-col { display:flex; flex-direction:column; align-items:center; padding-top:5px; flex-shrink:0; }
        .pp-log-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }

        .pp-log-entry-body { flex:1; min-width:0; }
        .pp-log-entry-action { font-size:0.78rem; font-weight:600; color:#111827; margin-bottom:3px; display:block; }
        .pp-log-entry-doctor { font-size:0.73rem; color:#6b7280; margin-bottom:5px; display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .pp-log-entry-footer { display:flex; align-items:center; gap:6px; flex-wrap:wrap; }
        .pp-log-pill { font-size:0.64rem; font-weight:700; padding:2px 7px; border-radius:100px; letter-spacing:0.03em; display:inline-flex; align-items:center; gap:3px; }
        .pp-log-ip { font-size:0.65rem; color:#b0b7c3; font-family:monospace; }

        .pp-log-entry-time { font-size:0.68rem; color:#9ca3af; white-space:nowrap; flex-shrink:0; padding-top:3px; }

        /* Spinner */
        @keyframes spin { to { transform:rotate(360deg); } }
        .pp-spinner { width:13px; height:13px; border:2px solid rgba(255,255,255,0.35); border-top-color:white; border-radius:50%; animation:spin 0.7s linear infinite; }

        @keyframes pp-fade-up { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .pp-anim { animation:pp-fade-up 0.4s ease both; }
        .pp-d1 { animation-delay:0.05s; }
        .pp-d2 { animation-delay:0.12s; }
        .pp-d3 { animation-delay:0.18s; }

        @media (max-width: 1024px) {
          .pp-grid { grid-template-columns: 1fr; }
          .pp-header-card { grid-column: 1; }
          .pp-right-col { grid-column: 1; grid-row: auto; position:static; max-height:none; }
          .pp-details-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 768px) {
          .pp-sidebar { display:none; }
          .pp-body { padding:20px 16px 40px; }
          .pp-details-grid { grid-template-columns:1fr; }
          .pp-record-fields { grid-template-columns:1fr; }
          .pp-form-grid-2 { grid-template-columns:1fr; }
          .pp-records-header { flex-wrap:wrap; gap:10px; }
        }
      `}</style>

      <div className="pp-layout">

        {/* ── NAV SIDEBAR ── */}
        <aside className="pp-sidebar">
          <a href="/" className="pp-logo">
            <span className="pp-logo-dot"/>
            MedChain+
          </a>
          <nav className="pp-nav">
            <Link href="/dashboard" className="pp-nav-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <rect x="3" y="3" width="7" height="7" rx="1.5"/>
                <rect x="14" y="3" width="7" height="7" rx="1.5"/>
                <rect x="3" y="14" width="7" height="7" rx="1.5"/>
                <rect x="14" y="14" width="7" height="7" rx="1.5"/>
              </svg>
              Dashboard
            </Link>
            <Link href="/dashboard/register-patient" className="pp-nav-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <line x1="19" y1="8" x2="19" y2="14"/>
                <line x1="16" y1="11" x2="22" y2="11"/>
              </svg>
              Register Patient
            </Link>
            <Link href="/dashboard/search" className="pp-nav-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
              Biometric Search
            </Link>
          </nav>
          <div className="pp-sidebar-footer">
            <button className="pp-logout" onClick={() => { localStorage.removeItem("token"); router.push("/login"); }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Sign out
            </button>
          </div>
        </aside>

        {/* ── PAGE BODY ── */}
        <div className="pp-body">
          <div className="pp-grid">

            {/* ══════════════════════════════════════
                PATIENT HEADER — spans full width
            ══════════════════════════════════════ */}
            <div className="pp-card pp-header-card pp-anim pp-d1">
              <div className="pp-header-top">
                <div style={{display:"flex", gap:14, alignItems:"flex-start"}}>
                  <div className="pp-avatar">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <div>
                    <h1 className="pp-patient-name">{patient.name}</h1>
                    <div className="pp-patient-meta">
                      {age && <span>{age} yrs</span>}
                      {patient.gender && <><span className="pp-meta-dot">·</span><span>{patient.gender}</span></>}
                      {patient.phone  && <><span className="pp-meta-dot">·</span><span>{patient.phone}</span></>}
                    </div>
                    <div style={{display:"flex", gap:6, flexWrap:"wrap"}}>
                      {patient.bloodGroup && <span className="pp-tag pp-tag-red">{patient.bloodGroup}</span>}
                      {patient.allergies  && <span className="pp-tag pp-tag-gray">⚠ Allergies on file</span>}
                      <span className="pp-tag pp-tag-green">
                        <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                          <circle cx="5" cy="5" r="5" fill="#10b981"/>
                          <path d="M3 5l1.5 1.5L7 3.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Verified
                      </span>
                    </div>
                  </div>
                </div>
                <button className="pp-toggle-btn" onClick={() => setExpanded(p => !p)}>
                  {expanded ? "Hide details" : "View details"}
                </button>
              </div>

              {expanded && (
                <div className="pp-details-grid">
                  {[
                    { label:"Email",               value: patient.email                || "—" },
                    { label:"Address",             value: patient.address              || "—" },
                    { label:"Blood Group",         value: patient.bloodGroup           || "—" },
                    { label:"Allergies",           value: patient.allergies            || "—" },
                    { label:"Current Medications", value: patient.currentMedications   || "—" },
                    { label:"Emergency Contact",   value: patient.emergencyContactName
                        ? `${patient.emergencyContactName} · ${patient.emergencyContactPhone || "—"}`
                        : "—" },
                  ].map(item => (
                    <div key={item.label} className="pp-detail-item">
                      <span className="pp-detail-label">{item.label}</span>
                      <span className="pp-detail-value">{item.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ══════════════════════════════════════
                LEFT COLUMN — Medical Records
            ══════════════════════════════════════ */}
            <div className="pp-left-col">
              <div className="pp-card pp-records-card pp-anim pp-d2">

                <div className="pp-records-header">
                  <h2 className="pp-records-title">Medical Records</h2>
                  <div className="pp-header-actions">
                    <button className="pp-btn pp-btn-outline" onClick={handleRegisterBiometric}>
                      <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" opacity="0.55">
                        <path fillRule="evenodd" clipRule="evenodd" d="M4.925.827A7.583 7.583 0 0115.66 9.316a.75.75 0 11-1.463-.333 6.083 6.083 0 00-8.61-6.81.75.75 0 01-.662-1.346zM3.278 2.903a.75.75 0 01.143 1.05 6.058 6.058 0 00-1.087 2.332 26.684 26.684 0 01-.811 2.9.75.75 0 11-1.416-.495c.262-.747.514-1.634.765-2.737a7.558 7.558 0 011.355-2.907.75.75 0 011.05-.143z"/>
                      </svg>
                      Register Biometric
                    </button>
                    <button className="pp-btn pp-btn-green" onClick={() => setShowForm(p => !p)}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                      {showForm ? "Cancel" : "Add Record"}
                    </button>
                  </div>
                </div>

                {/* Biometric QR */}
                {qrCode && (
                  <div className="pp-qr-box">
                    <img src={qrCode} alt="Biometric QR" style={{width:176, height:176, borderRadius:8}}/>
                    <p className="pp-qr-label">Ask the patient to scan this QR to register their biometrics</p>
                  </div>
                )}

                {/* Add Record Form */}
                {showForm && (
                  <form onSubmit={handleCreateRecord} className="pp-form">
                    <p className="pp-form-title">New Medical Record</p>
                    <div className="pp-form-grid">
                      <div className="pp-form-grid-2">
                        <div className="pp-field">
                          <label className="pp-label">Visit Type</label>
                          <select className="pp-select" value={visitType} onChange={e => setVisitType(e.target.value)}>
                            <option value="">Select type</option>
                            <option value="OPD">OPD</option>
                            <option value="Emergency">Emergency</option>
                            <option value="Follow-up">Follow-up</option>
                          </select>
                        </div>
                        <div className="pp-field">
                          <label className="pp-label">Follow-up Date</label>
                          <input className="pp-input" type="date" value={followUpDate} onChange={e => setFollowUpDate(e.target.value)}/>
                        </div>
                      </div>
                      <div className="pp-field">
                        <label className="pp-label">Chief Complaint</label>
                        <input className="pp-input" type="text" placeholder="Primary reason for visit" value={chiefComplaint} onChange={e => setChiefComplaint(e.target.value)}/>
                      </div>
                      <div className="pp-field">
                        <label className="pp-label">Vitals</label>
                        <input className="pp-input" type="text" placeholder="BP, HR, Temp, SpO2…" value={vitals} onChange={e => setVitals(e.target.value)}/>
                      </div>
                      <div className="pp-field">
                        <label className="pp-label">Diagnosis <span style={{color:"#ef4444"}}>*</span></label>
                        <input className="pp-input" type="text" placeholder="Clinical diagnosis" required value={diagnosis} onChange={e => setDiagnosis(e.target.value)}/>
                      </div>
                      <div className="pp-field">
                        <label className="pp-label">Prescription</label>
                        <textarea className="pp-textarea" placeholder="Medications prescribed…" value={prescription} onChange={e => setPrescription(e.target.value)}/>
                      </div>
                      <div className="pp-field">
                        <label className="pp-label">Investigations</label>
                        <input className="pp-input" type="text" placeholder="Lab tests, scans ordered…" value={investigations} onChange={e => setInvestigations(e.target.value)}/>
                      </div>
                      <div className="pp-field">
                        <label className="pp-label">Notes</label>
                        <textarea className="pp-textarea" placeholder="Additional clinical notes…" value={notes} onChange={e => setNotes(e.target.value)}/>
                      </div>
                    </div>
                    <div className="pp-form-actions">
                      <button type="submit" className="pp-btn pp-btn-green" disabled={savingRecord}>
                        {savingRecord ? <span className="pp-spinner"/> : "Save Record"}
                      </button>
                      <button type="button" className="pp-btn pp-btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                    </div>
                  </form>
                )}

                {/* Records list */}
                {records.length === 0 ? (
                  <div className="pp-empty">
                    <div className="pp-empty-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                    </div>
                    No medical records yet. Add the first record above.
                  </div>
                ) : records.map(record => (
                  <div key={record.id} className="pp-record">
                    <div className="pp-record-header">
                      <div>
                        <p className="pp-record-hospital">{record.doctor?.hospital?.name || "Unknown Hospital"}</p>
                        <p className="pp-record-doctor">Dr. {record.doctor?.name || "Unknown Doctor"}</p>
                      </div>
                      <div style={{display:"flex", flexDirection:"column", alignItems:"flex-end", gap:5}}>
                        <span className="pp-record-date">
                          {new Date(record.createdAt).toLocaleDateString("en-US", { day:"numeric", month:"short", year:"numeric" })}
                        </span>
                        {record.visitType && (
                          <span className="pp-tag" style={{
                            background: visitTypeColors[record.visitType] || "#f9fafb",
                            color:      visitTypeText[record.visitType]   || "#6b7280",
                            border:    `1px solid ${visitTypeColors[record.visitType] || "#e5e7eb"}`,
                          }}>
                            {record.visitType}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="pp-record-fields">
                      {record.chiefComplaint && <div className="pp-record-field"><span className="pp-record-field-label">Chief Complaint</span><span className="pp-record-field-value">{record.chiefComplaint}</span></div>}
                      {record.vitals         && <div className="pp-record-field"><span className="pp-record-field-label">Vitals</span><span className="pp-record-field-value">{record.vitals}</span></div>}
                      <div className="pp-record-field"><span className="pp-record-field-label">Diagnosis</span><span className="pp-record-field-value">{record.diagnosis}</span></div>
                      {record.prescription   && <div className="pp-record-field"><span className="pp-record-field-label">Prescription</span><span className="pp-record-field-value">{record.prescription}</span></div>}
                      {record.investigations && <div className="pp-record-field"><span className="pp-record-field-label">Investigations</span><span className="pp-record-field-value">{record.investigations}</span></div>}
                      {record.followUpDate   && <div className="pp-record-field"><span className="pp-record-field-label">Follow-up</span><span className="pp-record-field-value">{new Date(record.followUpDate).toLocaleDateString("en-US", { day:"numeric", month:"short", year:"numeric" })}</span></div>}
                      {record.notes && <div className="pp-record-field" style={{gridColumn:"1/-1"}}><span className="pp-record-field-label">Notes</span><span className="pp-record-field-value">{record.notes}</span></div>}
                    </div>

                    <div className="pp-attachments">
                      <p className="pp-attachments-label">Attachments</p>
                      <div className="pp-attach-row">
                        <label className="pp-upload-label">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="17 8 12 3 7 8"/>
                            <line x1="12" y1="3" x2="12" y2="15"/>
                          </svg>
                          Upload file
                          <input type="file" style={{display:"none"}} onChange={e => handleFileUpload(e, record.id)}/>
                        </label>
                        <span style={{fontSize:"0.7rem", color:"#9ca3af"}}>Lab reports, scans, PDFs</span>
                      </div>
                      {record.attachments?.length > 0 && (
                        <div style={{marginTop:7, display:"flex", flexDirection:"column", gap:5}}>
                          {record.attachments.map((file: any) => (
                            <div key={file.id} className="pp-attach-row">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.75">
                                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                              </svg>
                              <span className="pp-attach-name">{file.fileName}</span>
                              <button className="pp-attach-view" onClick={() => handleViewFile(file.filePath, record.id)}>View</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ══════════════════════════════════════
                RIGHT COLUMN — Access Log (sticky)
            ══════════════════════════════════════ */}
            <div className="pp-right-col pp-anim pp-d3">
              <div className="pp-card pp-log-card">

                <div className="pp-log-card-header">
                  <span className="pp-log-card-title">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                      <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z"/>
                    </svg>
                    Access Log
                  </span>
                  <span className="pp-log-card-count">{accessLogs.length}</span>
                </div>

                <div className="pp-log-scroll">
                  {accessLogs.length === 0 ? (
                    <div className="pp-empty" style={{padding:"24px 8px"}}>
                      <div className="pp-empty-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z"/>
                        </svg>
                      </div>
                      No access events yet.
                    </div>
                  ) : accessLogs.map((log: any) => {
                    const m = methodMeta[log.method] ?? methodMeta.MANUAL;
                    return (
                      <div key={log.id} className="pp-log-entry">

                        {/* Colored dot */}
                        <div className="pp-log-dot-col">
                          <div className="pp-log-dot" style={{background: m.dot}}/>
                        </div>

                        {/* Content */}
                        <div className="pp-log-entry-body">
                          <span className="pp-log-entry-action">
                            {actionLabel[log.action] ?? log.action.replace(/_/g," ").toLowerCase().replace(/^\w/,(c:string)=>c.toUpperCase())}
                          </span>
                          {log.user?.name && (
                            <span className="pp-log-entry-doctor">Dr. {log.user.name}</span>
                          )}
                          <div className="pp-log-entry-footer">
                            <span
                              className="pp-log-pill"
                              style={{background: m.bg, color: m.text, border:`1px solid ${m.border}`}}
                            >
                              {m.label}
                            </span>
                            {log.ipAddress && log.ipAddress !== "unknown" && (
                              <span className="pp-log-ip">{log.ipAddress}</span>
                            )}
                          </div>
                        </div>

                        {/* Time */}
                        <span className="pp-log-entry-time" title={new Date(log.createdAt).toLocaleString()}>
                          {relativeTime(log.createdAt)}
                        </span>

                      </div>
                    );
                  })}
                </div>

                {/* Footer rule */}
                {accessLogs.length > 0 && (
                  <div style={{
                    borderTop:"1px solid #f3f4f6", padding:"10px 0 14px",
                    fontSize:"0.68rem", color:"#9ca3af", textAlign:"center", flexShrink:0,
                  }}>
                    Last {accessLogs.length} event{accessLogs.length !== 1 ? "s" : ""}
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}