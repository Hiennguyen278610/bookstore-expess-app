"use client";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {GithubIcon} from "@/components/svg/github";
import {GoogleIcon} from "@/components/svg/google";

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {LoginRequestSchema} from "@/validation/authschemas";
import {setJWTtoCookie} from "@/lib/cookies";
import {login, useUser} from "@/services/authservices";
import {toast} from "react-toastify";
import {Checkbox} from "@/components/ui/checkbox";

type LoginRequest = {
    username: string;
    password: string;
};

export function LoginForm({
                              className,
                              ...props
                          }: React.ComponentProps<"form">) {
    const {mutate} = useUser();
    const {
        register,
        handleSubmit,
        formState: {errors},
        setError,
    } = useForm<LoginRequest>({
        defaultValues: {username: "", password: ""},
        resolver: zodResolver(LoginRequestSchema),
    });
    const onSubmit = async (data: LoginRequest) => {
        const res = await login(data);
        if ("token" in res) {
            await setJWTtoCookie(res.token);
            await mutate();
            toast.success("Login successfully");
            return;
        }
        if (res.code == "RUNTIME") {
            setError("password", {message: res.message});
            return;
        }
    };

    return (
        <form
            className={cn("flex flex-col gap-6", className)}
            {...props}
            onSubmit={handleSubmit(onSubmit)}
        >
            <Button variant="outline" className="w-full">
                <GoogleIcon/>
                Đăng nhập với Google
            </Button>
            <Button variant="outline" className="w-full">
                <GithubIcon/>
                Đăng nhập với Github
            </Button>
            <div className="grid gap-4">
                <div
                    className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Hoặc
          </span>
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="email">Email hoặc số điện thoại</Label>
                    <Input id="email" type="text" {...register("username")} />
                    <div>
                        {errors.username && (
                            <p className="text-red-600 text-sm">{errors.username.message}</p>
                        )}
                    </div>
                </div>
                <div className="grid gap-3">
                    <div className="flex items-center">
                        <Label htmlFor="password">Mật khẩu</Label>
                    </div>
                    <Input id="password" type="password" {...register("password")} />
                    <div>
                        {errors.password && (
                            <p className="text-red-600 text-sm">{errors.password.message}</p>
                        )}
                    </div>
                </div>
                <div className="flex gap-3 items-center justify-between">

                    <div className="flex items-start gap-2">
                        <Checkbox id="remember"/>
                        <Label htmlFor="remember">Ghi nhớ đăng nhập</Label>
                    </div>
                    <a
                        href="#"
                        className="text-sm underline underline-offset-4 text-sky-600"
                    >
                        Quên mật khẩu?
                    </a>
                </div>
                <Button type="submit" className="w-full">
                    Đăng nhập
                </Button>

            </div>
            <div className="text-center text-sm">
                Chưa có tài khoản?{" "}
                <a href="#" className="underline underline-offset-4 ">
                    Đăng ký
                </a>
            </div>
        </form>
    );
}
