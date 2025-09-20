import { AuthRequest, AuthResponse, Device, DeviceToggleResponse, WeatherResponse } from "@/types/api";

const API_BASE_URL = "/api";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new ApiError(response.status, errorData.error || "API request failed");
  }

  return response.json();
}

export async function login(username: string, password: string): Promise<AuthResponse> {
  const requestData: AuthRequest = { username, password };

  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(requestData),
  });
}

export async function signup(username: string, password: string): Promise<AuthResponse> {
  const requestData: AuthRequest = { username, password };

  return apiRequest<AuthResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(requestData),
  });
}

export function saveAuthToken(token: string): void {
  localStorage.setItem("authToken", token);
}

export function getAuthToken(): string | null {
  return localStorage.getItem("authToken");
}

export function removeAuthToken(): void {
  localStorage.removeItem("authToken");
}

export function saveUserId(userId: number): void {
  localStorage.setItem("userId", userId.toString());
}

export function getUserId(): number | null {
  const userId = localStorage.getItem("userId");
  return userId ? parseInt(userId, 10) : null;
}

export async function getDevices(userId: number): Promise<Device[]> {
  const token = getAuthToken();
  if (!token) {
    throw new Error("認証トークンがありません");
  }

  return apiRequest<Device[]>(`/devices?userId=${userId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
}

export async function toggleDevice(deviceId: number, open: boolean): Promise<DeviceToggleResponse> {
  const token = getAuthToken();
  if (!token) {
    throw new Error("認証トークンがありません");
  }

  return apiRequest<DeviceToggleResponse>("/devices/toggle", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ deviceId, open }),
  });
}

export async function getWeatherData(userId: number): Promise<WeatherResponse> {
  const token = getAuthToken();
  if (!token) {
    throw new Error("認証トークンがありません");
  }

  return apiRequest<WeatherResponse>(`/weather?userId=${userId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
}