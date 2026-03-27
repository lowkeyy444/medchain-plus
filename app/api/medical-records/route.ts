import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/getUserFromRequest";
import { generateRecordHash } from "@/lib/hash";

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("Decoded user:", user);

    const {
      patientId,
      visitType,
      chiefComplaint,
      vitals,
      diagnosis,
      prescription,
      investigations,
      followUpDate,
      notes,
    } = await req.json();

    if (!patientId || !diagnosis) {
      return NextResponse.json(
        { error: "Patient ID and diagnosis are required" },
        { status: 400 }
      );
    }

    if (!user.hospitalId) {
      return NextResponse.json(
        { error: "Doctor is not assigned to a hospital" },
        { status: 400 }
      );
    }

    // 🧠 STEP 1 — Get last record for chain
    const lastRecord = await prisma.medicalRecord.findFirst({
      where: { patientId: Number(patientId) },
      orderBy: { createdAt: "desc" },
    });

    const previousHash = lastRecord?.recordHash || "GENESIS";

    // 🧠 STEP 2 — Generate hash (deterministic)
    const recordHash = generateRecordHash({
      patientId: Number(patientId),
      doctorId: user.userId,
      diagnosis,
      prescription,
      notes,
      visitType,
      chiefComplaint,
      vitals,
      investigations,
      previousHash,
    });

    // 🧱 STEP 3 — Create record with hashes
    const record = await prisma.medicalRecord.create({
      data: {
        patient: {
          connect: { id: Number(patientId) },
        },
        doctor: {
          connect: { id: user.userId },
        },
        hospital: {
          connect: { id: user.hospitalId },
        },

        visitType,
        chiefComplaint,
        vitals,
        diagnosis,
        prescription,
        investigations,
        followUpDate: followUpDate
          ? new Date(followUpDate)
          : null,
        notes,

        // ✅ MedChain fields
        previousHash,
        recordHash,
      },
      include: {
        doctor: {
          include: {
            hospital: true,
          },
        },
        attachments: true,
      },
    });

    // 🔥 ACCESS LOGGING (UNCHANGED)
    await prisma.accessLog.create({
      data: {
        userId: user.userId,
        patientId: Number(patientId),
        medicalRecordId: record.id,
        action: "CREATE_RECORD",
      },
    });

    return NextResponse.json(record);

  } catch (error) {
    console.error("Create record error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}