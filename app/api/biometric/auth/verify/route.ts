import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import { isoBase64URL } from "@simplewebauthn/server/helpers";

const RP_ID = "kamdyn-polyarchic-doretha.ngrok-free.dev";
const ORIGIN = "https://kamdyn-polyarchic-doretha.ngrok-free.dev";

export async function POST(req: NextRequest) {
  console.log("======================================");
  console.log("🔍 AUTH VERIFY START");
  console.log("======================================");

  try {
    const { session, credential } = await req.json();

    console.log("📦 Received credential:");
    console.log(JSON.stringify(credential, null, 2));

    // Load session
    const accessSession = await prisma.accessSession.findUnique({
      where: { id: session },
    });

    if (!accessSession || !accessSession.challenge) {
      console.log("❌ Session invalid");
      return NextResponse.json({ error: "Invalid session" }, { status: 400 });
    }

    console.log("🧠 Challenge in DB:", accessSession.challenge);

    // Decode clientDataJSON to confirm challenge
    const clientData = JSON.parse(
      Buffer.from(
        credential.response.clientDataJSON,
        "base64url"
      ).toString()
    );

    console.log("🧠 Challenge in clientDataJSON:", clientData.challenge);

    if (clientData.challenge !== accessSession.challenge) {
      console.log("❌ Challenge mismatch");
      return NextResponse.json(
        { error: "Challenge mismatch" },
        { status: 400 }
      );
    }

    // Load stored credential
    const storedCredential = await prisma.biometricCredential.findUnique({
      where: { credentialId: credential.id },
    });

    if (!storedCredential) {
      console.log("❌ Credential not found in DB");
      return NextResponse.json(
        { error: "Credential not found" },
        { status: 400 }
      );
    }

    console.log("💾 Stored credential:", storedCredential);

    console.log("🚀 Calling verifyAuthenticationResponse...");

   const verification = await verifyAuthenticationResponse({
  response: credential,
  expectedChallenge: accessSession.challenge,
  expectedOrigin: ORIGIN,
  expectedRPID: RP_ID,
  credential: {
    id: storedCredential.credentialId,
    publicKey: isoBase64URL.toBuffer(storedCredential.publicKey),
    counter: storedCredential.counter,
  },
  requireUserVerification: true,
});

    console.log("✅ Verification result:", verification);

    if (!verification.verified) {
      console.log("❌ Verification returned false");
      return NextResponse.json(
        { error: "Verification failed" },
        { status: 400 }
      );
    }

    // Update counter
    await prisma.biometricCredential.update({
      where: { id: storedCredential.id },
      data: {
        counter: verification.authenticationInfo.newCounter,
      },
    });

    // Approve session
    await prisma.accessSession.update({
      where: { id: session },
      data: {
        patientId: storedCredential.patientId,
        status: "approved",
      },
    });

    console.log("🎉 AUTH SUCCESS");
    console.log("======================================");

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.log("🚨 VERIFY ERROR:");
    console.log(error);
    console.log("======================================");

    return NextResponse.json(
      { error: error?.message || "Internal error" },
      { status: 500 }
    );
  }
}