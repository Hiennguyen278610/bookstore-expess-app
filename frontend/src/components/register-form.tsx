"use client"
import {cn} from "@/lib/utils";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {RegisterRequestSchema} from "@/validation/authschemas";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {registerUser} from "@/services/authservices";

type RegisterRequest = {
    fullName: string;
    username: string;
    phone: string;
    email: string;
    password: string;
    confirmPassword: string;
}
export function RegisterForm({className,setMode, ...props}: React.ComponentProps<"form"> & {setMode?: (mode: "login" | "register") => void}) {
    const {
        register,
        handleSubmit,
        formState: {errors},
        setError,
    } = useForm<RegisterRequest>({
        resolver: zodResolver(RegisterRequestSchema),
        mode: "onChange"

    });
    const onSubmit = async (data: RegisterRequest) => {
        const res = await registerUser(data);
    }
    return (
        <form
            className={cn("flex flex-col gap-1", className)}
            {...props}
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="grid gap-3">
                <Input id="fullname" type="text" {...register("fullName")} placeholder="Họ và tên..." />
                <div>
                    {errors.fullName && (
                        <p className="text-red-600 text-sm">{errors.fullName.message}</p>
                    )}
                </div>
            </div>
            <div className="grid gap-3">
                <Input id="username" type="text" {...register("username")} placeholder="Tên đăng nhập" />
                <div>
                    {errors.username && (
                        <p className="text-red-600 text-sm">{errors.username.message}</p>
                    )}
                </div>
            </div>
            <div className="grid gap-3">
                <Input id="phone" type="text" {...register("phone")} placeholder="Số điện thoại"/>
                <div>
                    {errors.phone && (
                        <p className="text-red-600 text-sm">{errors.phone.message}</p>
                    )}
                </div>
            </div>
            <div className="grid gap-3">
                <Input id="email" type="email" {...register("email")} placeholder="Email"/>
                <div>
                    {errors.email && (
                        <p className="text-red-600 text-sm">{errors.email.message}</p>
                    )}
                </div>
            </div>
            <div className="grid gap-3">
                <Input id="password" type="password" {...register("password")} placeholder="Mật khẩu" />
                <div>
                    {errors.password && (
                        <p className="text-red-600 text-sm">{errors.password.message}</p>
                    )}
                </div>
            </div>
            <div className="grid gap-3">
                <Input id="confirmPassword" type="password" {...register("confirmPassword")} placeholder="Nhập lại mật khẩu"/>
                <div>
                    {errors.confirmPassword && (
                        <p className="text-red-600 text-sm">{errors.confirmPassword.message}</p>
                    )}
                </div>
            </div>
            <Button type="submit" className="w-full mt-1 cursor-pointer">
                Đăng ký
            </Button>
            <div className="text-center text-sm mt-1">
                Đã có tài khoản?{" "}
                <a className="underline underline-offset-4 cursor-pointer" onClick={() => setMode?.("login")}>
                    Đăng nhập
                </a>
            </div>
        </form>
    )
}