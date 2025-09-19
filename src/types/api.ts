// API型定義 (swagger.yamlに基づく)

export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  userId: string;
}

export interface User {
  userId: string;
  username: string;
}

export interface Device {
  deviceId: string;
  devicename: string;
  temperature: number;
  humidity: number;
  latitude: number;
  longitude: number;
  isOpen: boolean;
  userId: string;
}

export interface DeviceRegisterRequest {
  userId: string;
  deviceName: string;
}

export interface DeviceToggleRequest {
  deviceId: string;
  open: boolean;
}

export interface DeviceToggleResponse {
  success: boolean;
  isOpen: boolean;
}