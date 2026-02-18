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

    const token = generateToken(doctor.id);

    return NextResponse.json({
      message: "Login successful",
      token,
      doctor: {
        id: doctor.id,
        name: doctor.name,
        email: doctor.email,
        hospitalName: doctor.hospitalName,
      },
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}