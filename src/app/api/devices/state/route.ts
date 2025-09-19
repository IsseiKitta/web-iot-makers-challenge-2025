import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DeviceStateRequest, DeviceStateResponse } from "@/types/api";

export async function POST(request: NextRequest) {
  try {
    const body: DeviceStateRequest = await request.json();
    const { deviceId, temperature, humidity, latitude, longitude } = body;

    if (!deviceId || temperature === undefined || humidity === undefined ||
        latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { error: "deviceId, temperature, humidity, latitude, longitudeが必要です" },
        { status: 400 }
      );
    }

    const device = await prisma.device.findUnique({
      where: { id: deviceId },
    });

    if (!device) {
      return NextResponse.json(
        { error: "デバイスが見つかりません" },
        { status: 404 }
      );
    }

    const updatedDevice = await prisma.device.update({
      where: { id: deviceId },
      data: {
        temperature,
        humidity,
        latitude,
        longitude,
      },
    });

    const response: DeviceStateResponse = {
      success: true,
      isOpen: updatedDevice.isOpen,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("デバイス状態更新エラー:", error);
    return NextResponse.json(
      { error: "デバイス状態の更新に失敗しました" },
      { status: 500 }
    );
  }
}