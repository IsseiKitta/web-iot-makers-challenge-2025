"use client";

import { useState } from "react";

interface ContentCardProps {
  name: string;
  initialState?: "open" | "close";
}

export default function ContentCard({ name, initialState = "close" }: ContentCardProps) {
  const [state, setState] = useState<"open" | "close">(initialState);

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
            onClick={() => setState("open")}
            className={`w-[110px] font-bold text-[13px] leading-[1.21] py-[14px] px-[10px] rounded-l-[10px] ${
              state === "open"
                ? "bg-[#4360F0] text-[#FFF4F4]"
                : "bg-[#606165] text-[#FFF4F4]"
            }`}
          >
            OPEN
          </button>
          <button
            onClick={() => setState("close")}
            className={`w-[110px] font-bold text-[13px] leading-[1.21] py-[14px] px-[10px] rounded-r-[10px] ${
              state === "close"
                ? "bg-[#4360F0] text-[#FFF4F4]"
                : "bg-[#606165] text-[#FFF4F4]"
            }`}
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}