import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/getUserFromRequest";

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await prisma.accessSession.create({
      data: {
        doctorId: user.userId,
        status: "pending",
        accessType: "EMERGENCY",
        expiresAt: new Date(Date.now() + 1000 * 60 * 2), // 2 minutes
      },
    });

    return NextResponse.json({
      sessionId: session.id,
    });

  } catch (error) {
    console.error("Emergency session error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}