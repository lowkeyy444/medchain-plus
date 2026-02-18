import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/getUserFromRequest";
import { generateBiometricToken, hashBiometricToken } from "@/lib/biometric";

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const {
      name,
      dateOfBirth,
      gender,
      phone,
      email,
      address,
      bloodGroup,
      allergies,
      currentMedications,
      emergencyContactName,
      emergencyContactPhone,
    } = await req.json();

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone are required" },
        { status: 400 }
      );
    }

    // Generate biometric token
    const biometricToken = generateBiometricToken();
    const biometricHash = hashBiometricToken(biometricToken);

    const patient = await prisma.patient.create({
      data: {
        name,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender,
        phone,
        email,
        address,
        bloodGroup,
        allergies,
        currentMedications,
        emergencyContactName,
        emergencyContactPhone,
        biometricHash,
        registeredById: user.userId,
      },
    });

    return NextResponse.json({
      message: "Patient registered successfully",
      patientId: patient.id,
      biometricToken,
    });

  } catch (error) {
    console.error("Patient registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}