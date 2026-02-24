import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/getUserFromRequest";
import { generateRegistrationOptions } from "@simplewebauthn/server";
import { randomUUID } from "crypto";
import { Buffer } from "buffer";

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { patientId } = await req.json();

    if (!patientId) {
      return NextResponse.json(
        { error: "Patient ID required" },
        { status: 400 }
      );
    }

    // Create UUID session ID
    const sessionId = randomUUID();

    // Generate WebAuthn registration options
    const options = await generateRegistrationOptions({
      rpName: "MedChain+",
      rpID: "kamdyn-polyarchic-doretha.ngrok-free.dev",
      userID: Buffer.from(String(patientId)), // ✅ FIXED
      userName: `patient-${patientId}`,
      attestationType: "none",
      authenticatorSelection: {
        residentKey: "preferred",
        userVerification: "required",
      },
    });

    // Save session in DB
    await prisma.biometricSession.create({
      data: {
        id: sessionId,
        patientId: Number(patientId),
        challenge: options.challenge,
        expiresAt: new Date(Date.now() + 3 * 60 * 1000),
      },
    });

    // Return options + sessionId
    return NextResponse.json({
      ...options,
      sessionId,
    });

  } catch (error) {
    console.error("Biometric session error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}