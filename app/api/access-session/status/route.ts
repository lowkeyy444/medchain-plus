import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session");

  if (!sessionId) {
    return NextResponse.json({ error: "Session required" }, { status: 400 });
  }

  const session = await prisma.accessSession.findUnique({
    where: { id: sessionId },
  });

  if (!session) {
    return NextResponse.json({ error: "Invalid session" }, { status: 400 });
  }

  if (session.expiresAt < new Date()) {
    return NextResponse.json({ status: "expired" });
  }

  return NextResponse.json({
    status: session.status,
    patientId: session.patientId,
  });
}