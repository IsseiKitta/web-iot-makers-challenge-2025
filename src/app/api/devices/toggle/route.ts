import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { DeviceToggleRequest, DeviceToggleResponse } from "@/types/api";

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

    const body: DeviceToggleRequest = await request.json();
    const { deviceId, open } = body;

    if (!deviceId || typeof open !== "boolean") {
      return NextResponse.json(
        { error: "deviceId and open (boolean) are required" },
        { status: 400 }
      );
    }

    // デバイスが存在するかチェック
    const device = await prisma.device.findUnique({
      where: { id: deviceId },
    });

    if (!device) {
      return NextResponse.json(
        { error: "Device not found" },
        { status: 404 }
      );
    }

    // 認証されたユーザーがデバイスの所有者かチェック
    if (device.userId !== authenticatedUserId) {
      return NextResponse.json(
        { error: "Forbidden: You can only control your own devices" },
        { status: 403 }
      );
    }

    // TODO: ここで実際のIoTデバイスに開閉指示を送信する処理を追加
    // 例: await sendCommandToDevice(deviceId, open ? 'OPEN' : 'CLOSE');
    // 現在は成功したと仮定してデータベースを更新

    // デバイスの状態を更新
    const updatedDevice = await prisma.device.update({
      where: { id: deviceId },
      data: { isOpen: open },
    });

    const response: DeviceToggleResponse = {
      success: true,
      isOpen: updatedDevice.isOpen,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    console.error("Device toggle error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}