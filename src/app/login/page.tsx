import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#282828] flex flex-col items-center justify-start px-0 py-[10px] text-white">
      {/* Header */}
      <div className="w-[320px] flex flex-col justify-center items-center gap-6 py-[10px]">
        <h1 className="text-white text-center text-base font-bold leading-[1.21]">
          Ambrella
        </h1>
        <hr className="w-full border-t border-[#9A9A9A]" />
      </div>

      {/* Login Form */}
      <div className="w-[320px] flex flex-col items-center gap-5 px-[19px] py-3">
        {/* Form Title */}
        <div className="flex justify-center items-center gap-[10px] p-[10px]">
          <h2 className="text-white text-center text-base font-bold leading-[1.21]">
            おかえりなさい！
          </h2>
        </div>

        {/* Username Input */}
        <div className="w-full h-[47px] relative border border-white rounded-[5px]">
          <Input
            placeholder="ユーザー名"
            className="w-full h-full bg-transparent border-none text-white placeholder:text-white text-base font-normal leading-[1.21] px-[18px] py-[13px] focus:outline-none focus:ring-0 focus-visible:ring-0"
          />
        </div>

        {/* Password Input */}
        <div className="w-full h-[47px] relative border border-white rounded-[5px]">
          <Input
            type="password"
            placeholder="パスワード"
            className="w-full h-full bg-transparent border-none text-white placeholder:text-white text-base font-normal leading-[1.21] px-[18px] py-[13px] focus:outline-none focus:ring-0 focus-visible:ring-0"
          />
        </div>

        {/* Submit Button */}
        <div className="w-full flex flex-col justify-center items-center gap-[10px] p-[5px]">
          <Button className="w-full bg-[#4360F0] hover:bg-[#4360F0]/90 text-white font-bold text-xs leading-[1.21] py-2 px-0 rounded-[5px]">
            ログイン
          </Button>
        </div>
      </div>
    </div>
  )
}