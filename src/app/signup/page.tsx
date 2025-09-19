"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signup, saveAuthToken, saveUserId, ApiError } from "@/lib/api";
import Header from "@/components/common/Header";

export default function SignupPage() {
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

    if (password.length < 6) {
      setError("パスワードは6文字以上で入力してください");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await signup(username, password);

      saveAuthToken(response.token);
      saveUserId(response.userId);

      router.push("/");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 409) {
          setError("このユーザー名は既に使用されています");
        } else {
          setError("登録に失敗しました。もう一度お試しください");
        }
      } else {
        setError("ネットワークエラーが発生しました");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#282828] flex flex-col items-center justify-start px-0 py-[10px] text-white">
      {/* Header */}
      <Header />

      {/* Signup Form */}
      <form
        onSubmit={handleSubmit}
        className="w-[320px] flex flex-col items-center gap-5 px-[19px] py-3"
      >
        {/* Form Title */}
        <div className="flex justify-center items-center gap-[10px] p-[10px]">
          <h2 className="text-white text-center text-base font-bold leading-[1.21]">
            ユーザー登録
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
            placeholder="パスワード（6文字以上）"
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
            {isLoading ? "登録中..." : "登録"}
          </Button>
        </div>

        {/* Login Link */}
        <div className="w-full flex justify-center items-center p-[5px] mt-4">
          <span className="text-white text-sm">
            既にアカウントをお持ちの方は{" "}
            <a
              href="/login"
              className="text-[#4360F0] hover:text-[#4360F0]/80 underline font-medium"
            >
              ログイン
            </a>
          </span>
        </div>
      </form>
    </div>
  );
}
