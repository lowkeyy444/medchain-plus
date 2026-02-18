import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { generateToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const doctor = await prisma.user.findUnique({
      where: { email },
      include: {
        hospital: true, // 🔥 include hospital relation
      },
    });

    if (!doctor) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      doctor.password
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 🔥 Generate JWT with hospitalId included
    const token = generateToken({
      userId: doctor.id,
      email: doctor.email,
      hospitalId: doctor.hospitalId,
    });

    return NextResponse.json({
      message: "Login successful",
      token,
      doctor: {
        id: doctor.id,
        name: doctor.name,
        email: doctor.email,
        hospital: doctor.hospital
          ? {
              id: doctor.hospital.id,
              name: doctor.hospital.name,
            }
          : null,
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}