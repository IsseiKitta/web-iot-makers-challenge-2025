import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth";

interface WeatherData {
  deviceId: number;
  deviceName: string;
  rainfall: string;
  location: string;
  weatherType: "Sunny" | "cloudy" | "rainy";
  latitude: number;
  longitude: number;
}

export async function GET(request: NextRequest) {
  try {
    // JWT認証
    const authenticatedUserId = authenticateRequest(request);
    if (!authenticatedUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    // userIdをintegerに変換
    const userId = parseInt(userIdParam, 10);
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: "Invalid userId format" },
        { status: 400 }
      );
    }

    // 認証されたユーザーが要求されたユーザーIDと一致するかチェック
    if (authenticatedUserId !== userId) {
      return NextResponse.json(
        { error: "Forbidden: You can only access your own devices" },
        { status: 403 }
      );
    }

    // ユーザーのデバイス一覧を取得
    const devices = await prisma.device.findMany({
      where: {
        userId: userId,
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
      orderBy: {
        id: "asc",
      },
    });

    // 各デバイスの1時間後の天気データを生成
    const weatherDataPromises = devices.map(async (device) => {
      try {
        // Yahoo Weather APIで天気データを取得
        const weatherResponse = await fetch(
          `https://map.yahooapis.jp/weather/V1/place?coordinates=${device.longitude},${device.latitude}&appid=${process.env.YAHOO_API_KEY}&output=json&past=0&interval=5`
        );

        let rainfall = 0;

        // 天気データ取得
        if (weatherResponse.ok) {
          const weatherData = await weatherResponse.json();
          if (
            weatherData.Feature &&
            weatherData.Feature.length > 0 &&
            weatherData.Feature[0].Property &&
            weatherData.Feature[0].Property.WeatherList &&
            weatherData.Feature[0].Property.WeatherList.Weather &&
            weatherData.Feature[0].Property.WeatherList.Weather.length > 0
          ) {
            // 1時間後のデータを取得（配列の2番目の要素、0が現在、1が1時間後）
            const futureWeather =
              weatherData.Feature[0].Property.WeatherList.Weather[1] ||
              weatherData.Feature[0].Property.WeatherList.Weather[0];

            rainfall = parseFloat(futureWeather.Rainfall) || 0;
          }
        }

        // 降水量に基づいて天気タイプを決定
        const mappedWeatherType = rainfall > 0 ? "rainy" : "Sunny";

        const result: WeatherData = {
          deviceId: device.id,
          deviceName: device.name,
          rainfall: `${rainfall}mm`,
          location: "",
          weatherType: mappedWeatherType,
          latitude: device.latitude,
          longitude: device.longitude,
        };

        return result;
      } catch (error) {
        console.error(`Weather data error for device ${device.id}:`, error);

        // エラー時のフォールバック
        return {
          deviceId: device.id,
          deviceName: device.name,
          rainfall: "0mm",
          location: "",
          weatherType: "cloudy" as const,
          latitude: device.latitude,
          longitude: device.longitude,
        };
      }
    });

    const weatherData = await Promise.all(weatherDataPromises);

    return NextResponse.json({
      success: true,
      data: weatherData,
      message: "1時間後の天気予報データを取得しました",
    });
  } catch (err) {
    console.error("Get weather data error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
