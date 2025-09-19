"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken, getUserId, removeAuthToken } from "@/lib/api";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = getAuthToken();
    const storedUserId = getUserId();

    if (token && storedUserId) {
      setIsAuthenticated(true);
      setUserId(storedUserId);
    } else {
      setIsAuthenticated(false);
      setUserId(null);
    }
  }, []);

  const logout = () => {
    removeAuthToken();
    localStorage.removeItem("userId");
    setIsAuthenticated(false);
    setUserId(null);
    router.push("/login");
  };

  return {
    isAuthenticated,
    userId,
    logout,
    isLoading: isAuthenticated === null,
  };
}