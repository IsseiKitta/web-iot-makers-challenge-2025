// API型定義 (swagger.yamlに基づく)

export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
}

export interface User {
  userId: number;
  username: string;
}

export interface Device {
  deviceId: number;
  devicename: string;
  temperature: number;
  humidity: number;
  latitude: number;
  longitude: number;
  isOpen: boolean;
  userId: number;
}

export interface DeviceRegisterRequest {
  userId: number;
  deviceName: string;
}

export interface DeviceToggleRequest {
  deviceId: number;
  open: boolean;
}

export interface DeviceToggleResponse {
  success: boolean;
  isOpen: boolean;
}

export interface DeviceStateRequest {
  deviceId: number;
  temperature: number;
  humidity: number;
  latitude: number;
  longitude: number;
}

export interface DeviceStateResponse {
  success: boolean;
  isOpen: boolean;
}

export interface WeatherData {
  deviceId: number;
  deviceName: string;
  rainfall: string;
  location: string;
  weatherType: "Sunny" | "cloudy" | "rainy";
  latitude: number;
  longitude: number;
}

export interface WeatherResponse {
  success: boolean;
  data: WeatherData[];
  message: string;
}
