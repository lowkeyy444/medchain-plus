import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyRegistrationResponse } from "@simplewebauthn/server";
import { isoBase64URL } from "@simplewebauthn/server/helpers";

const RP_ID = "kamdyn-polyarchic-doretha.ngrok-free.dev";
const ORIGIN = "https://kamdyn-polyarchic-doretha.ngrok-free.dev";

export async function POST(req: NextRequest) {
  try {
    const { session, credential } = await req.json();

    if (!session || !credential) {
      return NextResponse.json(
        { error: "Missing session or credential" },
        { status: 400 }
      );
    }

    // 1️⃣ Find session
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

    // 2️⃣ Verify registration response
    const verification = await verifyRegistrationResponse({
      response: credential,
      expectedChallenge: biometricSession.challenge,
      expectedOrigin: ORIGIN,
      expectedRPID: RP_ID,
      requireUserVerification: true,
    });

    const { verified, registrationInfo } = verification;

    if (!verified || !registrationInfo) {
      return NextResponse.json(
        { error: "Verification failed" },
        { status: 400 }
      );
    }

    // 3️⃣ Store credential CORRECTLY (base64url)
    await prisma.biometricCredential.create({
      data: {
        patientId: biometricSession.patientId,
        credentialId: registrationInfo.credential.id, // already base64url
        publicKey: isoBase64URL.fromBuffer(
          registrationInfo.credential.publicKey
        ), // ✅ FIXED
        counter: registrationInfo.credential.counter,
        deviceName:
          credential.response?.transports?.[0] || "Unknown Device",
      },
    });

    // 4️⃣ Delete session
    await prisma.biometricSession.delete({
      where: { id: session },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Registration verify error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}