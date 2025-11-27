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

// Zod schema validate
const schema = z.object({
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu nhập lại không khớp",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token"); // ?token=abcxyz

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
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
      toast.error(err?.response?.data?.message || "Đổi mật khẩu thất bại");
    }
  };

  return (
    <div className="flex items-center justify-center h-[500px]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6 w-full max-w-md")}
      >
        <div className="grid gap-2 text-center">
          <h1 className="font-mono bold text-2xl">Tạo mật khẩu mới</h1>
          <p className="text-sm text-muted-foreground">
            Mật khẩu mới không được trùng với mật khẩu cũ của bạn.
          </p>
        </div>

        <div className="grid gap-3">
          <Label htmlFor="password">Mật khẩu mới</Label>
          <Input
            id="password"
            type="password"
            placeholder="Mật khẩu mới"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <div className="grid gap-3">
          <Label htmlFor="confirmPassword">Nhập lại mật khẩu mới</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Nhập lại mật khẩu mới"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full mt-1" disabled={isSubmitting}>
          {isSubmitting ? "Đang đổi..." : "Đổi mật khẩu"}
        </Button>
      </form>
    </div>
  );
}
