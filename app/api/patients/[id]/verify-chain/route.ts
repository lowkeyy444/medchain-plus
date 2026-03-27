import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateRecordHash } from "@/lib/hash";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const patientId = Number(id);

    if (!patientId || isNaN(patientId)) {
      return NextResponse.json(
        { error: "Invalid patient ID" },
        { status: 400 }
      );
    }

    const records = await prisma.medicalRecord.findMany({
      where: { patientId },
      orderBy: { createdAt: "asc" }, // VERY IMPORTANT
    });

    if (records.length === 0) {
      return NextResponse.json({ valid: true });
    }

    for (let i = 0; i < records.length; i++) {
      const record = records[i];

      // 🔁 Recalculate hash
      const recalculatedHash = generateRecordHash({
        patientId: record.patientId,
        doctorId: record.doctorId,
        diagnosis: record.diagnosis,
        prescription: record.prescription,
        notes: record.notes,
        visitType: record.visitType,
        chiefComplaint: record.chiefComplaint,
        vitals: record.vitals,
        investigations: record.investigations,
        previousHash: record.previousHash || "",
      });

      // ❌ Hash mismatch
      if (record.recordHash !== recalculatedHash) {
        return NextResponse.json({
          valid: false,
          brokenAt: record.id,
          reason: "Record data tampered",
        });
      }

      // 🔗 Chain integrity check (skip first)
      if (i > 0) {
        const prev = records[i - 1];

        if (record.previousHash !== prev.recordHash) {
          return NextResponse.json({
            valid: false,
            brokenAt: record.id,
            reason: "Chain broken",
          });
        }
      }
    }

    return NextResponse.json({ valid: true });

  } catch (error) {
    console.error("Chain verification error:", error);

    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}