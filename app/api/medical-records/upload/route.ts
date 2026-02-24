import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/getUserFromRequest";

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();

    const file = formData.get("file") as File;
    const recordId = formData.get("recordId");
    const patientId = formData.get("patientId");

    if (!file || !recordId || !patientId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const filePath = `patient-${patientId}/record-${recordId}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("medical-records")
      .upload(filePath, buffer, {
        contentType: file.type,
      });

    if (uploadError) {
      console.error(uploadError);
      return NextResponse.json(
        { error: "File upload failed" },
        { status: 500 }
      );
    }

    // Save metadata in DB
    const attachment = await prisma.medicalAttachment.create({
      data: {
        fileName: file.name,
        filePath,
        fileType: file.type,
        fileSize: file.size,
        medicalRecordId: Number(recordId),
      },
    });

    // 🔥 ADD THIS (UPLOAD LOGGING)
    await prisma.accessLog.create({
      data: {
        userId: user.userId,
        patientId: Number(patientId),
        medicalRecordId: Number(recordId),
        action: "UPLOAD_ATTACHMENT",
      },
    });

    return NextResponse.json({
      message: "File uploaded successfully",
      attachment,
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}