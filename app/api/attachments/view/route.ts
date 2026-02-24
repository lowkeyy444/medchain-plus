import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/getUserFromRequest";
import { supabase } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { filePath, patientId, recordId } = await req.json();

    if (!filePath || !patientId || !recordId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.storage
      .from("medical-records")
      .createSignedUrl(filePath, 60);

    if (error) {
      return NextResponse.json(
        { error: "Could not generate signed URL" },
        { status: 500 }
      );
    }

    // 🔥 LOG VIEW_ATTACHMENT
    await prisma.accessLog.create({
      data: {
        userId: user.userId,
        patientId: Number(patientId),
        medicalRecordId: Number(recordId),
        action: "VIEW_ATTACHMENT",
      },
    });

    return NextResponse.json({ url: data.signedUrl });

  } catch (error) {
    console.error("View attachment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}