import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/getUserFromRequest";

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 🔥 Debug (remove later if you want)
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

    const record = await prisma.medicalRecord.create({
      data: {
        // 🔥 Proper relational connects (IMPORTANT)
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

    return NextResponse.json(record);

  } catch (error) {
    console.error("Create record error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}