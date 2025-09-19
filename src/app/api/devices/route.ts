import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { Device } from "@/types/api";

export async function GET(request: NextRequest) {
  try {
    // JWT認証
    const authenticatedUserId = authenticateRequest(request);
    if (!authenticatedUserId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // クエリパラメータからuserIdを取得
    const searchParams = request.nextUrl.searchParams;
    const userIdParam = searchParams.get("userId");

    if (!userIdParam) {
      return NextResponse.json(
        { error: "userId query parameter is required" },
        { status: 400 }
      );
    }

    // 認証されたユーザーが要求されたユーザーIDと一致するかチェック
    if (authenticatedUserId !== userIdParam) {
      return NextResponse.json(
        { error: "Forbidden: You can only access your own devices" },
        { status: 403 }
      );
    }

    // ユーザーのデバイス一覧を取得
    const devices = await prisma.device.findMany({
      where: {
        userId: userIdParam,
      },
      select: {
        id: true,
        name: true,
        temperature: true,
        humidity: true,
        latitude: true,
        longitude: true,
        isOpen: true,
        userId: true,
      },
    });

    // Swagger仕様に合わせて変換
    const responseDevices: Device[] = devices.map((device) => ({
      deviceId: device.id,
      devicename: device.name,
      temperature: device.temperature,
      humidity: device.humidity,
      latitude: device.latitude,
      longitude: device.longitude,
      isOpen: device.isOpen,
      userId: device.userId,
    }));

    return NextResponse.json(responseDevices, { status: 200 });
  } catch (err) {
    console.error("Get devices error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}