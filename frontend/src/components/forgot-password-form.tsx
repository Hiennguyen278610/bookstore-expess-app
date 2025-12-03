import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label'; // Nhớ import thêm Label cho đồng bộ
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { sendMailForgotPassword } from '@/services/authservices';

// Move schema ra ngoài component để tránh khởi tạo lại mỗi lần render
const schema = z.object({
  email: z.string().email('Email không đúng định dạng')
});
type FormData = z.infer<typeof schema>;

export function ForgotPasswordForm({ className, setMode, onSuccess, ...props }: React.ComponentProps<'form'> & {
  setMode?: (mode: 'login' | 'register' | 'reset-password') => void
  onSuccess?: () => void
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    defaultValues: { email: '' },
    resolver: zodResolver(schema),
    mode: 'onChange'
  });

  const onSubmit = async (data: FormData) => {
    try {
      await sendMailForgotPassword(data.email);
      onSuccess?.();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={cn("grid gap-6", className)}>
      <div className="text-center grid gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Quên mật khẩu?</h1>
        <p className="text-sm text-muted-foreground text-balance">
          Nhập email của bạn và chúng tôi sẽ gửi đường dẫn đặt lại mật khẩu.
        </p>
      </div>

      <form {...props} className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <Label htmlFor="email" className={cn(errors.email && "text-red-500")}>
            Email đăng ký
          </Label>
          <Input
            {...register("email")}
            id="email"
            type="email"
            placeholder="name@example.com"
            className={cn(errors.email && "border-red-500 focus-visible:ring-red-500")}
          />
          {errors.email && (
            <p className="text-red-500 text-xs font-medium animate-in fade-in-50 slide-in-from-top-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting}>
          {isSubmitting ? 'Đang gửi yêu cầu...' : 'Gửi yêu cầu'}
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        Đã nhớ ra mật khẩu?{' '}
        <a className="underline underline-offset-4 cursor-pointer text-primary hover:text-primary/80" onClick={() => setMode?.('login')}>
          Đăng nhập
        </a>
      </div>
    </div>
  );
}