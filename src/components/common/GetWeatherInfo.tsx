import Image from "next/image";
import React from "react";

interface WeatherInfoCardProps {
  deviceName: string;
  temperature: string;
  location: string;
  weatherType: "sunny" | "cloudy" | "rainy";
}

const GetWeatherInfo: React.FC<WeatherInfoCardProps> = ({
  deviceName,
  temperature,
  location,
  weatherType,
}) => {
  const getWeatherIcon = () => {
    switch (weatherType) {
      case "sunny":
        return (
          <Image
            src={"public/sun-solid-full.svg"}
            alt={"Sunny Icon"}
            width={500}
            height={500}
          ></Image>
        );
      case "cloudy":
        return <div></div>;
      case "rainy":
        return <div></div>;
      default:
        return (
          <Image
            src={"public/sun-solid-full.svg"}
            alt={"Sunny Icon"}
            width={500}
            height={500}
          ></Image>
        );
    }
  };

  return (
    <div className="bg-[#4E4E4E] rounded-[10px] p-[9px_6px] text-white w-[246px] h-[190px] flex flex-col relative">
      <div className="absolute top-[9px] right-[6px] w-[134px] flex justify-center items-center p-[10px_0px]">
        <span className="font-inter font-bold text-[13px] leading-[1.21] text-center">
          1時間後の天気
        </span>
      </div>

      <div className="flex justify-center items-center p-[5px_0px] h-[32px]">
        <span className="font-inter font-bold text-[17px] leading-[1.21] text-center">
          {deviceName}
        </span>
      </div>

      <div className="flex justify-center items-center p-[10px_10px_30px_25px] h-[84px]">
        <span className="font-inter font-bold text-[30px] leading-[1.21] text-center">
          {temperature}
        </span>
      </div>

      <div className="absolute top-[84px] right-[22px] flex justify-center items-center p-[0px_10px_10px] w-[70px] h-[70px]">
        {getWeatherIcon()}
      </div>

      <div className="flex justify-center items-center p-[25px_53px_5px] mt-[10px]">
        <span className="font-inter font-bold text-[15px] leading-[1.21] text-center">
          {location}
        </span>
      </div>
    </div>
  );
};

export default GetWeatherInfo;
