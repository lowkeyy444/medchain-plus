import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/getUserFromRequest";
import { hashBiometricToken } from "@/lib/biometric";

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { biometricToken } = await req.json();

    if (!biometricToken) {
      return NextResponse.json(
        { error: "Biometric token is required" },
        { status: 400 }
      );
    }

    const hashedToken = hashBiometricToken(biometricToken);

    const patient = await prisma.patient.findUnique({
      where: {
        biometricHash: hashedToken,
      },
    });

    if (!patient) {
      return NextResponse.json(
        { error: "Patient not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      patientId: patient.id,
    });

  } catch (error) {
    console.error("Biometric search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}