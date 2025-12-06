"use client";

import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Camera } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { updateProfile } from '@/services/authservices'; // Import tiện ích class

// 1. Định nghĩa Schema Validation
const profileSchema = z.object({
  username: z.string(), // Read-only nên không cần validate gắt
  email: z.string().email(), // Read-only
  fullName: z.string().min(2, "Họ và tên phải có ít nhất 2 ký tự").max(50, "Tên quá dài"),
  phone: z.string().regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, "Số điện thoại không đúng định dạng VN"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileTab({ user }: { user: any }) {

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: "onChange"
  });

  useEffect(() => {
    if (user?.data) {
      reset({
        username: user.data.username || "",
        fullName: user.data.fullName || "",
        phone: user.data.phone || "",
        email: user.data.email || "",
      });
    }
  }, [user, reset]);

  const onUpdateProfile = async (data: ProfileFormValues) => {
    try {
      const res = await updateProfile(data);
      if (res.code == "INTERNAL_ERROR"){
        setError("phone", {message: res.message})
        return
      }
      toast.success("Cập nhật thông tin thành công");
      reset(data);
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  return (
    <Card className="border-none shadow-none bg-transparent lg:bg-white lg:border lg:shadow-sm">
      <CardHeader className="px-0 lg:px-6 pt-0 lg:pt-6">
        <CardTitle className="text-xl">Thông tin cá nhân</CardTitle>
        <CardDescription>Quản lý thông tin hiển thị và liên hệ của bạn</CardDescription>
      </CardHeader>
      <CardContent className="px-0 lg:px-6 pb-6">
        <form onSubmit={handleSubmit(onUpdateProfile)} className="bg-white lg:bg-transparent p-4 lg:p-0 rounded-xl border lg:border-none shadow-sm lg:shadow-none space-y-6">

          <div className="flex flex-col md:flex-row gap-6 md:gap-10">
            <div className="flex flex-col items-center gap-4 shrink-0">
              <div className="relative group cursor-pointer">
                <div className="h-28 w-28 rounded-full bg-primary/10 flex items-center justify-center text-4xl font-bold text-primary border-4 border-white shadow-md overflow-hidden ring-1 ring-gray-100">
                  {user?.data?.fullName ? user.data.fullName.charAt(0).toUpperCase() : <User />}
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="text-white w-8 h-8"/>
                </div>
              </div>
              <Button variant="outline" size="sm" type="button" className="w-32">Chọn ảnh</Button>
              <p className="text-xs text-muted-foreground text-center max-w-[150px]">
                Dung lượng tối đa 1MB<br/>Định dạng: .JPEG, .PNG
              </p>
            </div>

            <div className="flex-1 space-y-5 w-full">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="username">Tên đăng nhập</Label>
                  <Input
                    id="username"
                    {...register("username")}
                    disabled
                    className="bg-gray-50 text-gray-500 cursor-not-allowed focus-visible:ring-0"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    {...register("email")}
                    disabled
                    className="bg-gray-50 text-gray-500 cursor-not-allowed focus-visible:ring-0"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="fullName" className={cn(errors.fullName && "text-red-500")}>
                  Họ và tên
                </Label>
                <Input
                  id="fullName"
                  {...register("fullName")}
                  className={cn(errors.fullName && "border-red-500 focus-visible:ring-red-500")}
                  placeholder="Nhập họ và tên của bạn"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs font-medium animate-in fade-in-50 slide-in-from-top-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone" className={cn(errors.phone && "text-red-500")}>
                  Số điện thoại
                </Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  className={cn(errors.phone && "border-red-500 focus-visible:ring-red-500")}
                  placeholder="Nhập số điện thoại"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs font-medium animate-in fade-in-50 slide-in-from-top-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  disabled={!isDirty || isSubmitting}
                  className="w-full md:w-auto min-w-[140px]"
                >
                  {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}