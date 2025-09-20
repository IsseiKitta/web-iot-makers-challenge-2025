import ContentCard from "./ContentCard";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getDevices, getWeatherData } from "@/lib/api";
import GetWeatherInfo from "./GetWeatherInfo";
import { WeatherData } from "@/types/api";

interface SwitchContentProps {
  activeTab: "home" | "temperature" | "location";
}

interface Device {
  deviceId: number;
  devicename: string;
  temperature: number;
  humidity: number;
  latitude: number;
  longitude: number;
  isOpen: boolean;
  userId: number;
}

export default function SwitchContent({ activeTab }: SwitchContentProps) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const { userId, logout } = useAuth();

  const loadDevices = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const deviceData = await getDevices(userId);
      setDevices(deviceData);
    } catch (error) {
      console.error("デバイス取得エラー:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const loadWeatherData = useCallback(async () => {
    if (!userId) return;

    try {
      setWeatherLoading(true);
      const response = await getWeatherData(userId);
      setWeatherData(response.data);
    } catch (error) {
      console.error("天気データ取得エラー:", error);
    } finally {
      setWeatherLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId && (activeTab === "home" || activeTab === "temperature")) {
      loadDevices();
    }
    if (userId && activeTab === "location") {
      loadWeatherData();
    }
  }, [userId, activeTab, loadDevices, loadWeatherData]);

  switch (activeTab) {
    case "home":
      return (
        <div className="flex-1 flex flex-col w-[500px] h-full">
          {/* User Profile Section - Upper Half */}
          <div className="flex-1 flex flex-col justify-center items-center gap-4 p-4 mt-3">
            <div className="w-20 h-20 bg-[#4360F0] rounded-full flex justify-center items-center">
              <span className="text-white font-bold text-2xl">
                {userId?.toString().slice(-1) || "U"}
              </span>
            </div>
            <div className="mt-3 mb-5">
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded"
              >
                ログアウト
              </button>
            </div>
          </div>

          {/* Device Cards Section - Lower Half */}
          <div className="flex-1 flex flex-col justify-start items-center gap-5">
            {loading ? (
              <div className="text-white">読み込み中...</div>
            ) : devices.length > 0 ? (
              <div className="w-full flex flex-col gap-[34px] px-14 max-h-[300px] overflow-y-auto">
                {devices.map((device) => (
                  <ContentCard
                    key={device.deviceId}
                    name={device.devicename}
                    initialState={device.isOpen ? "open" : "close"}
                    deviceId={device.deviceId}
                    onToggle={loadDevices}
                  />
                ))}
              </div>
            ) : (
              <div className="text-white">デバイスが登録されていません</div>
            )}
          </div>
        </div>
      );

    case "temperature":
      return (
        <div className="flex-1 flex flex-col gap-5 w-[500px] mt-5">
          <div className="flex justify-center gap-[10px] p-[15px] pb-[10px]">
            <h2 className="text-white font-bold text-[25px] leading-[1.21]">
              パラソルの状態
            </h2>
          </div>

          <div className="flex justify-center w-full">
            {loading ? (
              <div className="text-white">読み込み中...</div>
            ) : devices.length > 0 ? (
              <table className="border-collapse">
                <thead>
                  <tr>
                    <th className="w-[110px] h-[35px] bg-[#4360F0] border border-white text-white font-bold text-[17px] leading-[1.21] p-[7px]">
                      パラソル名
                    </th>
                    <th className="w-[110px] h-[35px] bg-[#4360F0] border border-white text-white font-bold text-[17px] leading-[1.21] p-[7px]">
                      温度
                    </th>
                    <th className="w-[110px] h-[35px] bg-[#4360F0] border border-white text-white font-bold text-[17px] leading-[1.21] p-[7px]">
                      湿度
                    </th>
                    <th className="w-[110px] h-[35px] bg-[#4360F0] border border-white text-white font-bold text-[17px] leading-[1.21] p-[7px]">
                      状態
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {devices.map((device) => (
                    <tr key={device.deviceId}>
                      <td className="w-[110px] h-[35px] border border-white text-center text-white font-bold text-[17px] leading-[1.21] p-[5px]">
                        {device.devicename}
                      </td>
                      <td className="w-[110px] h-[35px] border border-white text-center text-white font-bold text-[17px] leading-[1.21] p-[5px]">
                        {Math.round(device.temperature)}°
                      </td>
                      <td className="w-[110px] h-[35px] border border-white text-center text-white font-bold text-[17px] leading-[1.21] p-[5px]">
                        {Math.round(device.humidity)}%
                      </td>
                      <td className="w-[110px] h-[35px] border border-white text-center text-white font-bold text-[17px] leading-[1.21] p-[5px]">
                        {device.isOpen ? "開" : "閉"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-white">デバイスが登録されていません</div>
            )}
          </div>
        </div>
      );

    case "location":
      return (
        <div className="flex-1 flex flex-col items-center mt-5">
          <div>
            <h2 className="text-white font-bold text-[25px] leading-[1.21] mb-7">
              天気予報
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-4 max-w-4xl">
            {weatherLoading ? (
              <div className="text-white">読み込み中...</div>
            ) : weatherData.length > 0 ? (
              weatherData.map((weather) => (
                <GetWeatherInfo
                  key={weather.deviceId}
                  deviceName={weather.deviceName}
                  rainfall={weather.rainfall}
                  location={weather.location}
                  weatherType={weather.weatherType}
                />
              ))
            ) : (
              <div className="text-white">天気データがありません</div>
            )}
          </div>
        </div>
      );

    default:
      return null;
  }
}
