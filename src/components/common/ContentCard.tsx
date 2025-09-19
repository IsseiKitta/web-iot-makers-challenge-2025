"use client";

import { useState } from "react";
import { toggleDevice } from "@/lib/api";

interface ContentCardProps {
  name: string;
  initialState?: "open" | "close";
  deviceId?: number;
  onToggle?: () => void;
}

export default function ContentCard({ name, initialState = "close", deviceId, onToggle }: ContentCardProps) {
  const [state, setState] = useState<"open" | "close">(initialState);
  const [loading, setLoading] = useState(false);

  const handleToggle = async (newState: "open" | "close") => {
    if (!deviceId) {
      setState(newState);
      return;
    }

    try {
      setLoading(true);
      await toggleDevice(deviceId, newState === "open");
      setState(newState);
      onToggle?.();
    } catch (error) {
      console.error("デバイス操作エラー:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#4E4E4E] rounded-[20px] p-[10px] h-[125px] flex flex-col gap-[9px]">
      <div className="flex justify-center items-center gap-[10px] p-[5px] w-[104px]">
        <span className="text-white font-bold text-[18px] leading-[1.21]">
          {name}
        </span>
      </div>

      <div className="flex-1 flex justify-center items-center p-[10px]">
        <div className="flex gap-0">
          <button
            onClick={() => handleToggle("open")}
            disabled={loading}
            className={`w-[110px] font-bold text-[13px] leading-[1.21] py-[14px] px-[10px] rounded-l-[10px] ${
              state === "open"
                ? "bg-[#4360F0] text-[#FFF4F4]"
                : "bg-[#606165] text-[#FFF4F4]"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading && state !== "open" ? "..." : "OPEN"}
          </button>
          <button
            onClick={() => handleToggle("close")}
            disabled={loading}
            className={`w-[110px] font-bold text-[13px] leading-[1.21] py-[14px] px-[10px] rounded-r-[10px] ${
              state === "close"
                ? "bg-[#4360F0] text-[#FFF4F4]"
                : "bg-[#606165] text-[#FFF4F4]"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading && state !== "close" ? "..." : "CLOSE"}
          </button>
        </div>
      </div>
    </div>
  );
}