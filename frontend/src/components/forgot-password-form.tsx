import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { sendMailForgotPassword } from '@/services/authservices';

export function ForgotPasswordForm({ className, setMode, ...props }: React.ComponentProps<'form'> & {
  setMode?: (mode: 'login' | 'register' | 'reset-password') => void
}) {
  const schema = z.object({
    email: z.string().email('Email không hợp lệ')
  });
  type FormData = z.infer<typeof schema>;

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
      const res =await sendMailForgotPassword(data.email);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <div className="text-center text-sm gap-1 mb-3">
        Nếu bạn đã có tài khoản?{' '}
        <a className="underline underline-offset-4 cursor-pointer" onClick={() => setMode?.('login')}>
          Đăng nhập
        </a>
      </div>
      <form {...props} className={cn('flex flex-col gap-4', className)} onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2 text-center">
          <h1 className="font-mono bold text-2xl">Nhập email đã đăng ký tài khoản</h1>
          <p className="text-sm text-muted-foreground">
            Hệ thống sẽ gửi đường dẫn<br /> thay đổi mật khẩu đến email của bạn.
          </p>
        </div>
        <div className="grid gap-3">
          <Input
            {...register("email")}
            id="email"
            type="text"
            placeholder="abc@xyz.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>
        <Button type="submit" className="w-full cursor-pointer">
          {isSubmitting ? 'Đang gửi...' : 'Gửi'}
        </Button>
      </form>
    </>
  );
}