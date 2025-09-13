// リクエストボディの型定義

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

// レスポンスの型定義

export interface LoginResponse {
  user: {
    id: number;
    name: string;
  };
  token: string;
}
