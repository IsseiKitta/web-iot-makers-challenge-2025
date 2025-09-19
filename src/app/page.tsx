"use client";

import Header from "@/components/common/Header";
import SwitchContent from "@/components/common/SwitchContent";
import NavigationFooter from "@/components/common/NavigationFooter";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const [activeTab, setActiveTab] = useState<
    "home" | "temperature" | "location"
  >("home");
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#282828] flex justify-center items-center">
        <div className="text-white text-lg">読み込み中...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col w-[500px] mx-auto text-white bg-[#282828]">
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
