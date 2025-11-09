import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import type { Role } from "@prisma/client";
import { signUpSchema } from "@/lib/zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name, role } = await signUpSchema.parseAsync(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        role: role as Role,
        isVerified: role === "STUDENT", // Students are auto-verified, agents need verification
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isVerified: true,
        image: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        user,
        message:
          role === "AGENT"
            ? "Account created! Please wait for admin verification before posting properties."
            : "Account created successfully!",
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || "Validation error" },
        { status: 400 }
      );
    }
    console.error("Signup error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create user",
      },
      { status: 500 }
    );
  }
}
