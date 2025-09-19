"use client";

import Header from "@/components/common/Header";
import SwitchContent from "@/components/common/SwitchContent";
import NavigationFooter from "@/components/common/NavigationFooter";
import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<
    "home" | "temperature" | "location"
  >("home");

  return (
    <div className="min-h-screen bg-[#282828] flex flex-col w-[500px] mx-auto text-white">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex-1 flex justify-center items-center p-2">
        <SwitchContent activeTab={activeTab} />
      </div>

      {/* Navigation Footer */}
      <NavigationFooter activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
