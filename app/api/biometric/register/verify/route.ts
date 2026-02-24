import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyRegistrationResponse } from "@simplewebauthn/server";

export async function POST(req: NextRequest) {
  try {
    const { session, credential } = await req.json();

    if (!session || !credential) {
      return NextResponse.json(
        { error: "Missing session or credential" },
        { status: 400 }
      );
    }

    // 🔥 Find session
    const biometricSession = await prisma.biometricSession.findUnique({
      where: { id: session },
    });

    if (!biometricSession) {
      return NextResponse.json(
        { error: "Invalid session" },
        { status: 400 }
      );
    }

    if (biometricSession.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Session expired" },
        { status: 400 }
      );
    }

    // 🔥 Verify response
    const verification = await verifyRegistrationResponse({
      response: credential,
      expectedChallenge: biometricSession.challenge,
      expectedOrigin: "https://kamdyn-polyarchic-doretha.ngrok-free.dev",
      expectedRPID: "kamdyn-polyarchic-doretha.ngrok-free.dev",
    });

    const { verified, registrationInfo } = verification;

    if (!verified || !registrationInfo) {
      return NextResponse.json(
        { error: "Verification failed" },
        { status: 400 }
      );
    }

    // 🔥 Store credential (convert buffers → base64 strings)
    await prisma.biometricCredential.create({
      data: {
        patientId: biometricSession.patientId,
        credentialId: registrationInfo.credential.id,
        publicKey: Buffer.from(
          registrationInfo.credential.publicKey
        ).toString("base64"),
        counter: registrationInfo.credential.counter,
        deviceName: credential.response?.transports?.[0] || "Unknown Device",
      },
    });

    // 🔥 Delete session
    await prisma.biometricSession.delete({
      where: { id: session },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Verification error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}