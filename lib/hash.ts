import crypto from "crypto";

export function generateRecordHash(data: {
  patientId: number;
  doctorId: number;
  diagnosis: string;
  prescription: string;
  notes?: string | null;
  visitType?: string | null;
  chiefComplaint?: string | null;
  vitals?: string | null;
  investigations?: string | null;
  previousHash: string;
}) {
  const normalized = {
    patientId: data.patientId,
    doctorId: data.doctorId,
    diagnosis: data.diagnosis,
    prescription: data.prescription,
    notes: data.notes || "",
    visitType: data.visitType || "",
    chiefComplaint: data.chiefComplaint || "",
    vitals: data.vitals || "",
    investigations: data.investigations || "",
    previousHash: data.previousHash,
  };

  return crypto
    .createHash("sha256")
    .update(JSON.stringify(normalized))
    .digest("hex");
}