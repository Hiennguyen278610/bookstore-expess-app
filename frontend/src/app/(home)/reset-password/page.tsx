"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios";
import { Suspense } from "react"; // Next.js yêu cầu bọc useSearchParams trong Suspense

const schema = z.object({
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu nhập lại không khớp",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

function ResetPasswordFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    if (!token) {
      toast.error("Token không hợp lệ hoặc đã hết hạn");
      return;
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
        {
          token,
          newPassword: data.password,
        }
      );

      toast.success("Đổi mật khẩu thành công!");
      router.push("/");
    } catch (err: any) {
      const error = err as any;
      toast.error(error?.response?.data?.message || "Đổi mật khẩu thất bại");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[500px] w-full p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header Section */}
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Tạo mật khẩu mới</h1>
          <p className="text-sm text-muted-foreground text-balance">
            Vui lòng nhập mật khẩu mới cho tài khoản của bạn.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="password" className={cn(errors.password && "text-red-500")}>
              Mật khẩu mới
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className={cn(errors.password && "border-red-500 focus-visible:ring-red-500")}
            />
            {errors.password && (
              <p className="text-red-500 text-xs font-medium animate-in fade-in-50 slide-in-from-top-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Nhập lại mật khẩu */}
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword" className={cn(errors.confirmPassword && "text-red-500")}>
              Xác nhận mật khẩu
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              {...register("confirmPassword")}
              className={cn(errors.confirmPassword && "border-red-500 focus-visible:ring-red-500")}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs font-medium animate-in fade-in-50 slide-in-from-top-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full mt-2 cursor-pointer" disabled={isSubmitting}>
            {isSubmitting ? "Đang xử lý..." : "Lưu mật khẩu mới"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    // Cần Suspense vì useSearchParams hoạt động ở client side và phụ thuộc vào URL query
    <Suspense fallback={<div className="flex justify-center p-10">Đang tải...</div>}>
      <ResetPasswordFormContent />
    </Suspense>
  )
}