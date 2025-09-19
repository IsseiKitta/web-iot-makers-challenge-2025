import ContentCard from "./ContentCard";

interface SwitchContentProps {
  activeTab: "home" | "temperature" | "location";
}

export default function SwitchContent({ activeTab }: SwitchContentProps) {
  switch (activeTab) {
    case "home":
      return (
        <div className="flex-1 flex flex-col justify-center items-center gap-5 w-[500px]">
          <div className="flex justify-center items-center gap-[10px] p-[17px] pb-[13px] w-[250px]">
            <h2 className="text-white font-bold text-[25px] leading-[1.21]">
              パラソルの開閉
            </h2>
          </div>

          <div className="w-full flex flex-col gap-[34px] px-14">
            <ContentCard name="パラソルA" initialState="open" />
            <ContentCard name="パラソルB" initialState="close" />
          </div>
        </div>
      );

    case "temperature":
      return (
        <div className="flex-1 flex flex-col justify-center items-center gap-5">
          <div className="flex justify-center items-center gap-[10px] p-[15px] pb-[10px]">
            <h2 className="text-white font-bold text-[13px] leading-[1.21]">
              パラソルの状態
            </h2>
          </div>

          <div className="w-full">
            {/* Header */}
            <div className="flex w-full">
              <div className="w-[70px] h-[22px] bg-[#4360F0] border border-white flex justify-center items-center p-[7px] pb-[5px]">
                <span className="text-white font-bold text-[9px] leading-[1.21]">
                  パラソル名
                </span>
              </div>
              <div className="w-[70px] h-[22px] bg-[#4360F0] border border-white flex justify-center items-center p-[7px] pb-[5px]">
                <span className="text-white font-bold text-[9px] leading-[1.21]">
                  温度
                </span>
              </div>
              <div className="w-[70px] h-[22px] bg-[#4360F0] border border-white flex justify-center items-center p-[7px] pb-[5px]">
                <span className="text-white font-bold text-[9px] leading-[1.21]">
                  湿度
                </span>
              </div>
              <div className="w-[70px] h-[22px] bg-[#4360F0] border border-white flex justify-center items-center p-[7px] pb-[5px]">
                <span className="text-white font-bold text-[9px] leading-[1.21]">
                  状態
                </span>
              </div>
            </div>

            {/* Row 1 */}
            <div className="flex w-full">
              <div className="w-[70px] border border-white flex justify-center items-center p-[5px] pb-[7px]">
                <span className="text-white font-bold text-[9px] leading-[1.21]">
                  パラソルA
                </span>
              </div>
              <div className="w-[70px] border border-white flex justify-center items-center p-[5px] pb-[7px]">
                <span className="text-white font-bold text-[9px] leading-[1.21]">
                  32°
                </span>
              </div>
              <div className="w-[70px] border border-white flex justify-center items-center p-[5px] pb-[7px]">
                <span className="text-white font-bold text-[9px] leading-[1.21]">
                  65%
                </span>
              </div>
              <div className="w-[70px] border border-white flex justify-center items-center p-[5px] pb-[7px]">
                <span className="text-white font-bold text-[9px] leading-[1.21]">
                  開
                </span>
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex w-full">
              <div className="w-[70px] border border-white flex justify-center items-center p-[5px] pb-[7px]">
                <span className="text-white font-bold text-[9px] leading-[1.21]">
                  パラソルB
                </span>
              </div>
              <div className="w-[70px] border border-white flex justify-center items-center p-[5px] pb-[7px]">
                <span className="text-white font-bold text-[9px] leading-[1.21]">
                  26°
                </span>
              </div>
              <div className="w-[70px] border border-white flex justify-center items-center p-[5px] pb-[7px]">
                <span className="text-white font-bold text-[9px] leading-[1.21]">
                  58%
                </span>
              </div>
              <div className="w-[70px] border border-white flex justify-center items-center p-[5px] pb-[7px]">
                <span className="text-white font-bold text-[9px] leading-[1.21]">
                  閉
                </span>
              </div>
            </div>
          </div>
        </div>
      );

    case "location":
      return (
        <div className="flex-1 flex justify-center items-center">
          <span className="text-white font-bold text-[16px] leading-[1.21]">
            位置情報
          </span>
        </div>
      );

    default:
      return null;
  }
}
