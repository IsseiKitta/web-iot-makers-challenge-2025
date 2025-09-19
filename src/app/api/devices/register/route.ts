import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { DeviceRegisterRequest, Device } from "@/types/api";

export async function POST(request: NextRequest) {
  try {
    // JWT認証
    const authenticatedUserId = authenticateRequest(request);
    if (!authenticatedUserId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body: DeviceRegisterRequest = await request.json();
    const { userId, deviceName } = body;

    if (!userId || !deviceName) {
      return NextResponse.json(
        { error: "userId and deviceName are required" },
        { status: 400 }
      );
    }

    // 認証されたユーザーが要求されたユーザーIDと一致するかチェック
    if (authenticatedUserId !== userId) {
      return NextResponse.json(
        { error: "Forbidden: You can only register devices for yourself" },
        { status: 403 }
      );
    }

    // ユーザーが存在するかチェック
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // デバイス名の重複チェック
    const existingDevice = await prisma.device.findUnique({
      where: { name: deviceName },
    });

    if (existingDevice) {
      return NextResponse.json(
        { error: "Device name already exists" },
        { status: 409 }
      );
    }

    // デバイスを作成
    // TODO: 実際のIoTデバイスからの初期値を設定する必要があります
    // 現在は仮の値を設定しています
    const device = await prisma.device.create({
      data: {
        name: deviceName,
        userId: userId,
        temperature: 25.0, // TODO: デバイスから取得
        humidity: 50.0,    // TODO: デバイスから取得
        latitude: 35.6762, // TODO: デバイスから取得 (東京駅の座標)
        longitude: 139.6503, // TODO: デバイスから取得
        isOpen: false,     // TODO: デバイスから取得
      },
    });

    // Swagger仕様に合わせて変換
    const responseDevice: Device = {
      deviceId: device.id,
      devicename: device.name,
      temperature: device.temperature,
      humidity: device.humidity,
      latitude: device.latitude,
      longitude: device.longitude,
      isOpen: device.isOpen,
      userId: device.userId,
    };

    return NextResponse.json(responseDevice, { status: 201 });
  } catch (err) {
    console.error("Device registration error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}