import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateRegistrationOptions } from "@simplewebauthn/server";
import { Buffer } from "buffer";

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get("session");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session required" },
        { status: 400 }
      );
    }

    const session = await prisma.biometricSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return NextResponse.json(
        { error: "Invalid session" },
        { status: 400 }
      );
    }

    if (session.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Session expired" },
        { status: 400 }
      );
    }

    // 🔥 IMPORTANT FIX
    // Decode stored base64 challenge back to buffer
    const decodedChallenge = Buffer.from(
      session.challenge,
      "base64url"
    );

    const options = await generateRegistrationOptions({
      rpName: "MedChain+",
      rpID: "kamdyn-polyarchic-doretha.ngrok-free.dev",
      userID: Buffer.from(String(session.patientId)),
      userName: `patient-${session.patientId}`,
      challenge: decodedChallenge,
      attestationType: "none",
      authenticatorSelection: {
        residentKey: "preferred",
        userVerification: "required",
      },
    });

    return NextResponse.json(options);

  } catch (error) {
    console.error("Options fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}