"use client";
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginRequestSchema } from '@/validation/authschemas';
import { setJWTtoCookie } from '@/lib/cookies';
import { login, useUser } from '@/services/authservices';
import { Checkbox } from '@/components/ui/checkbox';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ButtonLoginGoogle } from '@/components/button/button-google-login';
import { toast } from 'sonner';

type LoginRequest = {
  username: string;
  password: string;
};

export function LoginForm({
                            className,
                            setMode,
                            onSuccess,
                            ...props
                          }: React.ComponentProps<'form'> & {
  setMode?: (mode: 'login' | 'register' | 'reset-password') => void
  onSuccess?: () => void
}) {
  const {mutate} = useUser();
  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
    setError,
  } = useForm<LoginRequest>({
    defaultValues: {username: "", password: ""},
    resolver: zodResolver(LoginRequestSchema),
    mode: 'onChange'
  });

  const onSubmit = async (data: LoginRequest) => {
    const res = await login(data);
    if (res.code == "USER_NOT_FOUND") {
      setError("username", {message: res.message});
      return;
    }
    if (res.code == "INVALID_PASSWORD") {
      setError("password", { message: res.message });
      return;
    }
    if ("token" in res.data) {
      await setJWTtoCookie(res.data.token);
      await mutate();
      toast.success("Đăng nhập thành công");
      onSuccess?.();
      return;
    }
  };

  return (
    <div className={cn("grid gap-6", className)}>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
        <ButtonLoginGoogle onSuccess={onSuccess} />
      </GoogleOAuthProvider>

      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              Hoặc
            </span>
      </div>

      <form
        className="grid gap-4"
        {...props}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid gap-2">
          <Label htmlFor="username" className={cn(errors.username && "text-red-500")}>
            Email hoặc tên đăng nhập
          </Label>
          <Input
            id="username"
            type="text"
            {...register("username")}
            className={cn(errors.username && "border-red-500 focus-visible:ring-red-500")}
            placeholder="name@example.com"
          />
          {errors.username && (
            <p className="text-red-500 text-xs font-medium animate-in fade-in-50 slide-in-from-top-1">
              {errors.username.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className={cn(errors.password && "text-red-500")}>
              Mật khẩu
            </Label>
          </div>
          <Input
            id="password"
            type="password"
            {...register("password")}
            className={cn(errors.password && "border-red-500 focus-visible:ring-red-500")}
            placeholder="Mật khẩu"
          />
          {errors.password && (
            <p className="text-red-500 text-xs font-medium animate-in fade-in-50 slide-in-from-top-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex gap-3 items-center justify-between mt-1">
          <div className="flex items-center gap-2 cursor-pointer">
            <Checkbox id="remember"/>
            <Label htmlFor="remember" className="cursor-pointer font-normal">Ghi nhớ đăng nhập</Label>
          </div>
          <a
            onClick={() => setMode?.('reset-password')}
            className="text-sm font-medium underline underline-offset-4 text-sky-600 cursor-pointer hover:text-sky-700"
          >
            Quên mật khẩu?
          </a>
        </div>

        <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting}>
          {isSubmitting ? 'Đang xác thực...' : 'Đăng nhập'}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          Chưa có tài khoản?{" "}
          <a className="underline underline-offset-4 cursor-pointer text-primary hover:text-primary/80" onClick={() => setMode?.("register")}>
            Đăng ký ngay
          </a>
        </div>
      </form>
    </div>
  );
}