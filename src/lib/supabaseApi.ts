import { supabase } from '@/lib/supabase';
import { AuthRequest, AuthResponse } from '@/types/api';

export class SupabaseApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "SupabaseApiError";
  }
}

export async function signUpWithSupabase(username: string, password: string): Promise<AuthResponse> {
  try {
    // Supabaseの認証を使用してユーザーを作成
    const { data, error } = await supabase.auth.signUp({
      email: `${username}@local.app`, // ユーザー名をメールアドレス形式に変換
      password: password,
      options: {
        data: {
          username: username,
        }
      }
    });

    if (error) {
      throw new SupabaseApiError(400, error.message);
    }

    if (!data.user) {
      throw new SupabaseApiError(400, "ユーザーの作成に失敗しました");
    }

    // JWTトークンを取得
    const { data: sessionData } = await supabase.auth.getSession();

    if (!sessionData.session) {
      throw new SupabaseApiError(400, "セッションの取得に失敗しました");
    }

    return {
      token: sessionData.session.access_token,
      userId: parseInt(data.user.id) || 1, // Supabaseはstring IDなので、適切に変換
    };
  } catch (error) {
    if (error instanceof SupabaseApiError) {
      throw error;
    }
    throw new SupabaseApiError(500, "サインアップに失敗しました");
  }
}

export async function signInWithSupabase(username: string, password: string): Promise<AuthResponse> {
  try {
    // Supabaseの認証を使用してログイン
    const { data, error } = await supabase.auth.signInWithPassword({
      email: `${username}@local.app`, // ユーザー名をメールアドレス形式に変換
      password: password,
    });

    if (error) {
      throw new SupabaseApiError(401, "ユーザー名またはパスワードが間違っています");
    }

    if (!data.user || !data.session) {
      throw new SupabaseApiError(401, "ログインに失敗しました");
    }

    return {
      token: data.session.access_token,
      userId: parseInt(data.user.id) || 1, // Supabaseはstring IDなので、適切に変換
    };
  } catch (error) {
    if (error instanceof SupabaseApiError) {
      throw error;
    }
    throw new SupabaseApiError(500, "ログインに失敗しました");
  }
}

export async function signOutFromSupabase(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new SupabaseApiError(500, "ログアウトに失敗しました");
  }
}