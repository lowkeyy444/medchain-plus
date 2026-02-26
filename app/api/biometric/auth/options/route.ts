import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateAuthenticationOptions } from "@simplewebauthn/server";

const RP_ID = "kamdyn-polyarchic-doretha.ngrok-free.dev";

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get("session");

    if (!sessionId) {
      return NextResponse.json({ error: "Session required" }, { status: 400 });
    }

    const session = await prisma.accessSession.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Invalid or expired session" },
        { status: 400 }
      );
    }

    // Load ALL credentials (QR flow doesn't know patient yet)
    const credentials = await prisma.biometricCredential.findMany();

    if (credentials.length === 0) {
      return NextResponse.json(
        { error: "No biometric credentials found" },
        { status: 400 }
      );
    }

    const options = await generateAuthenticationOptions({
      rpID: RP_ID,
      userVerification: "required",
      allowCredentials: credentials.map((cred) => ({
        id: cred.credentialId, // MUST be base64url string
        type: "public-key",
      })),
    });

    // Store challenge EXACTLY as generated
    await prisma.accessSession.update({
      where: { id: sessionId },
      data: { challenge: options.challenge },
    });

    console.log("🧠 Generated challenge:", options.challenge);

    return NextResponse.json(options);

  } catch (error: any) {
    console.error("Auth options error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}