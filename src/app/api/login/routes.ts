import { NextRequest, NextResponse } from "next/server";
import { userService } from "@/service/user.service";
import { generateToken } from "@/utils/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "ユーザー名とパスワードが必須です" },
        { status: 400 }
      );
    }

    const user = await userService.authenticate(username, password);

    if (!user) {
      return NextResponse.json(
        { error: "ユーザー名またはパスワードが間違っています" },
        { status: 401 }
      );
    }

    const token = generateToken(user.id);

    return NextResponse.json({
      success: true,
      user,
      token,
    });
  } catch (error) {
    console.error("Login error", error);
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}
