import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { doctorId } = await req.json();

    if (!doctorId) {
      return NextResponse.json(
        { error: "Doctor ID required" },
        { status: 400 }
      );
    }

    const sessionId = randomUUID();

    await prisma.accessSession.create({
      data: {
        id: sessionId,
        doctorId: Number(doctorId),
        status: "pending",
        expiresAt: new Date(Date.now() + 3 * 60 * 1000),
      },
    });

    return NextResponse.json({ sessionId });

  } catch (error: any) {
    console.error("Auth session error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal error" },
      { status: 500 }
    );
  }
}