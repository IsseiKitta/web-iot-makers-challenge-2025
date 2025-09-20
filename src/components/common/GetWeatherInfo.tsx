import Image from "next/image";
import React from "react";

interface WeatherInfoCardProps {
  deviceName: string;
  rainfall: string;
  location: string;
  weatherType: "Sunny" | "cloudy" | "rainy";
}

const GetWeatherInfo: React.FC<WeatherInfoCardProps> = ({
  deviceName,
  rainfall,
  location,
  weatherType,
}) => {
  const getWeatherIcon = () => {
    const iconConfig = {
      Sunny: { src: "/sun-solid-full.svg", alt: "晴れ" },
      cloudy: { src: "/cloud-solid-full.svg", alt: "曇り" },
      rainy: { src: "/droplet-solid-full.svg", alt: "雨" },
    };

    const config = iconConfig[weatherType] || iconConfig.Sunny;

    return (
      <Image
        src={config.src}
        alt={config.alt}
        width={48}
        height={48}
        className="w-12 h-12"
      />
    );
  };

  return (
    <div className="bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl p-4 text-white min-w-[200px] max-w-[390px] w-full shadow-lg hover:shadow-xl transition-shadow duration-300 mb-7">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <p className="text-xs opacity-80 mb-1">1時間後の天気</p>
          <h3 className="font-bold text-lg leading-tight">{deviceName}</h3>
        </div>
        <div className="flex-shrink-0 ml-3">{getWeatherIcon()}</div>
      </div>

      <div className="text-center mb-10">
        <span className="text-7xl font-bold">{rainfall}</span>
      </div>

      <div className="text-center">
        <p className="text-1xl opacity-90">{location}</p>
      </div>
    </div>
  );
};

export default GetWeatherInfo;
