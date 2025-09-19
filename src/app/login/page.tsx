"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, saveAuthToken, saveUserId, ApiError } from "@/lib/api";
import Header from "@/components/common/Header";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setError("ユーザー名とパスワードを入力してください");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await login(username, password);

      saveAuthToken(response.token);
      saveUserId(response.userId);

      router.push("/");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setError("ユーザー名またはパスワードが間違っています");
        } else {
          setError("ログインに失敗しました。もう一度お試しください");
        }
      } else {
        setError("ネットワークエラーが発生しました");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col w-[500px] mx-auto text-white bg-[#282828]">
      {/* Header */}
      <Header />
      {/* Login Form */}
      <div className="flex-1 flex justify-center items-center p-2">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[320px] flex flex-col items-center gap-5 px-[19px] py-3"
        >
        {/* Form Title */}
        <div className="flex justify-center items-center gap-[10px] p-[10px]">
          <h2 className="text-white text-center text-base font-bold leading-[1.21]">
            おかえりなさい！
          </h2>
        </div>

        {/* Error Message */}
        {error && (
          <div className="w-full p-3 bg-red-500/20 border border-red-500 rounded-[5px] text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Username Input */}
        <div className="w-full h-[47px] relative border border-white rounded-[5px]">
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ユーザー名"
            disabled={isLoading}
            className="w-full h-full bg-transparent border-none text-white placeholder:text-white text-base font-normal leading-[1.21] px-[18px] py-[13px] focus:outline-none focus:ring-0 focus-visible:ring-0"
          />
        </div>

        {/* Password Input */}
        <div className="w-full h-[47px] relative border border-white rounded-[5px]">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="パスワード"
            disabled={isLoading}
            className="w-full h-full bg-transparent border-none text-white placeholder:text-white text-base font-normal leading-[1.21] px-[18px] py-[13px] focus:outline-none focus:ring-0 focus-visible:ring-0"
          />
        </div>

        {/* Submit Button */}
        <div className="w-full flex flex-col justify-center items-center gap-[10px] p-[5px]">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#4360F0] hover:bg-[#4360F0]/90 disabled:opacity-50 text-white font-bold text-xs leading-[1.21] py-2 px-0 rounded-[5px]"
          >
            {isLoading ? "ログイン中..." : "ログイン"}
          </Button>
        </div>

        {/* Signup Link */}
        <div className="w-full flex justify-center items-center p-[5px] mt-4">
          <span className="text-white text-sm">
            アカウントをお持ちでない方は{" "}
            <a
              href="/signup"
              className="text-[#4360F0] hover:text-[#4360F0]/80 underline font-medium"
            >
              新規登録
            </a>
          </span>
        </div>
        </form>
      </div>
    </div>
  );
}
