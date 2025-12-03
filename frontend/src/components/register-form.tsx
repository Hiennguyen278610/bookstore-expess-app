'use client';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterRequestSchema } from '@/validation/authschemas';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { registerUser, useUser } from '@/services/authservices';
import { setJWTtoCookie } from '@/lib/cookies';
import { toast } from 'sonner';

type RegisterRequest = {
    fullName: string;
    username: string;
    phone: string;
    email: string;
    password: string;
    confirmPassword: string;
}
type BackendError = {
    field: string;
    message: string;
};

export function RegisterForm({ className, setMode, onSuccess, ...props }: React.ComponentProps<'form'> & {
    setMode?: (mode: 'login' | 'register') => void
    onSuccess?: () => void
}) {
    const { mutate } = useUser();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<RegisterRequest>({
        resolver: zodResolver(RegisterRequestSchema),
        mode: "onChange"
    });

    const onSubmit = async (data: RegisterRequest) => {
        const res = await registerUser(data);
        if (res.errors) {
            res.errors.forEach((err : BackendError) => {
                setError(err.field as keyof RegisterRequest, { message: err.message });
            });
            return;
        }
        if ('token' in res.data) {
            await setJWTtoCookie(res.data.token);
            await mutate();
            toast.success('Đăng kí thành công');
            onSuccess?.();
            return;
        }
    }

    const ErrorMessage = ({ message }: { message?: string }) => {
        if (!message) return null;
        return (
          <p className="text-red-500 text-xs font-medium animate-in fade-in-50 slide-in-from-top-1">
              {message}
          </p>
        );
    };

    return (
      <form
        className={cn("grid gap-4", className)}
        {...props}
        onSubmit={handleSubmit(onSubmit)}
      >
          <div className="grid gap-2">
              <Input
                id="fullname"
                type="text"
                {...register("fullName")}
                placeholder="Họ và tên"
                className={cn(errors.fullName && "border-red-500 focus-visible:ring-red-500")}
              />
              <ErrorMessage message={errors.fullName?.message} />
          </div>

          <div className="grid gap-2">
              <Input
                id="username"
                type="text"
                {...register("username")}
                placeholder="Tên đăng nhập"
                className={cn(errors.username && "border-red-500 focus-visible:ring-red-500")}
              />
              <ErrorMessage message={errors.username?.message} />
          </div>

          <div className="grid gap-2">
              <Input
                id="phone"
                type="text"
                {...register("phone")}
                placeholder="Số điện thoại"
                className={cn(errors.phone && "border-red-500 focus-visible:ring-red-500")}
              />
              <ErrorMessage message={errors.phone?.message} />
          </div>

          <div className="grid gap-2">
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="Email"
                className={cn(errors.email && "border-red-500 focus-visible:ring-red-500")}
              />
              <ErrorMessage message={errors.email?.message} />
          </div>

          <div className="grid gap-2">
              <Input
                id="password"
                type="password"
                {...register("password")}
                placeholder="Mật khẩu"
                className={cn(errors.password && "border-red-500 focus-visible:ring-red-500")}
              />
              <ErrorMessage message={errors.password?.message} />
          </div>

          <div className="grid gap-2">
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                placeholder="Nhập lại mật khẩu"
                className={cn(errors.confirmPassword && "border-red-500 focus-visible:ring-red-500")}
              />
              <ErrorMessage message={errors.confirmPassword?.message} />
          </div>

          <Button type="submit" className="w-full mt-2 cursor-pointer" disabled={isSubmitting}>
              {isSubmitting ? 'Đang xử lý...' : 'Đăng ký'}
          </Button>

          <div className="text-center text-sm text-muted-foreground mt-1">
              Đã có tài khoản?{" "}
              <a className="underline underline-offset-4 cursor-pointer text-primary hover:text-primary/80" onClick={() => setMode?.("login")}>
                  Đăng nhập
              </a>
          </div>
      </form>
    )
}