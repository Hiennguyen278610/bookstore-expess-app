'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils'; // Import cn để xử lý class động
import { toast } from 'sonner';
import { resetPasswordAfterLogin } from '@/services/authservices'; // Import toast

// Schema validation
const schema = z.object({
  currentPassword: z.string().min(1, 'Vui lòng nhập mật khẩu hiện tại'),
  newPassword: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự'),
  confirmPassword: z.string().min(1, 'Vui lòng nhập lại mật khẩu mới')
})
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'Mật khẩu mới không được trùng với mật khẩu hiện tại',
    path: ['newPassword']
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu nhập lại không khớp',
    path: ['confirmPassword']
  })

type FormData = z.infer<typeof schema>;

export function PasswordTab() {

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange'
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await resetPasswordAfterLogin(data.currentPassword, data.newPassword);
      if (res.code == 'INTERNAL_ERROR') {
        setError('currentPassword', { message: res.message });
        return;
      }
      toast.success('Đổi mật khẩu thành công!');
      reset();
    } catch (error) {
      toast.error('Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu cũ.');
    }
  };

  return (
    <Card className="border-none shadow-none bg-transparent lg:bg-white lg:border lg:shadow-sm">
      <CardHeader className="px-0 lg:px-6 pt-0 lg:pt-6">
        <CardTitle className="text-xl">Đổi mật khẩu</CardTitle>
        <CardDescription>Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác.</CardDescription>
      </CardHeader>
      <CardContent className="px-0 lg:px-6 pb-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white lg:bg-transparent p-5 lg:p-0 rounded-xl border lg:border-none shadow-sm lg:shadow-none space-y-5 max-w-lg"
        >
          <div className="grid gap-2">
            <Label htmlFor="currentPassword" className={cn(errors.currentPassword && 'text-red-500')}>
              Mật khẩu hiện tại
            </Label>
            <Input
              id="currentPassword"
              type="password"
              placeholder="********"
              {...register('currentPassword')}
              className={cn(errors.currentPassword && 'border-red-500 focus-visible:ring-red-500')}
            />
            {errors.currentPassword && (
              <p className="text-red-500 text-xs font-medium animate-in fade-in-50 slide-in-from-top-1">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="newPassword" className={cn(errors.newPassword && 'text-red-500')}>
              Mật khẩu mới
            </Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Tối thiểu 6 ký tự"
              {...register('newPassword')}
              className={cn(errors.newPassword && 'border-red-500 focus-visible:ring-red-500')}
            />
            {errors.newPassword && (
              <p className="text-red-500 text-xs font-medium animate-in fade-in-50 slide-in-from-top-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="confirmPassword" className={cn(errors.confirmPassword && 'text-red-500')}>
              Nhập lại mật khẩu mới
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="********"
              {...register('confirmPassword')}
              className={cn(errors.confirmPassword && 'border-red-500 focus-visible:ring-red-500')}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs font-medium animate-in fade-in-50 slide-in-from-top-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" className="w-full md:w-auto min-w-[140px]" disabled={isSubmitting}>
              {isSubmitting ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}