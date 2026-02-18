import { NextRequest, NextResponse } from "next/server";
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

    const { filePath } = await req.json();

    const { data, error } = await supabase.storage
      .from("medical-records")
      .createSignedUrl(filePath, 60); // 60 sec

    if (error) {
      return NextResponse.json(
        { error: "Could not generate signed URL" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: data.signedUrl });

  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}