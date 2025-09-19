import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { generateToken } from "@/lib/jwt";
import { AuthRequest, AuthResponse } from "@/types/api";

export async function POST(req: Request) {
  try {
    const body: AuthRequest = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "username and password are required." },
        { status: 400 }
      );
    }

    // ユーザー名の重複チェック
    const existingUser = await prisma.user.findUnique({
      where: { name: username },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: username,
        password_hash: passwordHash,
      },
    });

    const token = generateToken(user.id);

    const response: AuthResponse = {
      token,
      userId: user.id,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
