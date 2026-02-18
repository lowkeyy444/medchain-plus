import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/getUserFromRequest";
import { supabase } from "@/lib/supabase";

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
    const medicalRecordId = formData.get("medicalRecordId");

    if (!file || !medicalRecordId) {
      return NextResponse.json(
        { error: "File and medicalRecordId required" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filePath = `record-${medicalRecordId}/${Date.now()}-${file.name}`;

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

    const attachment = await prisma.medicalAttachment.create({
      data: {
        fileName: file.name,
        filePath,
        fileType: file.type,
        fileSize: file.size,
        medicalRecord: {
          connect: { id: Number(medicalRecordId) },
        },
      },
    });

    return NextResponse.json(attachment);

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}