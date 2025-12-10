'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { LoginForm } from '@/components/login-form';
import { RegisterForm } from '@/components/register-form';
import { useState, useRef } from 'react'; // Thêm useRef
import { ForgotPasswordForm } from '@/components/forgot-password-form';
import gsap from 'gsap'; // Import GSAP
import { useGSAP } from '@gsap/react'; // Import hook useGSAP

type Mode = 'login' | 'register' | 'reset-password';

export function AuthDialog({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>('login');
  const [open, setOpen] = useState(false);

  // 1. Tạo ref cho container chứa form để scope animation
  const containerRef = useRef<HTMLDivElement>(null);
  // 2. Tạo ref cho hình ảnh để animate riêng
  const imageRef = useRef<HTMLImageElement>(null);

  // 3. Setup Animation
  useGSAP(() => {
    // Chỉ chạy khi dialog mở
    if (!open) return;

    // Animation cho Form: Mỗi khi 'mode' thay đổi, chạy animation này
    // '.anim-element' là class chúng ta sẽ gắn vào Title và Form body
    gsap.fromTo(".anim-element",
      {
        y: 20,
        opacity: 0,
        filter: "blur(5px)" // Hiệu ứng mờ ảo hiện đại
      },
      {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.4,
        stagger: 0.1, // Title hiện trước, Form hiện sau 0.1s
        ease: "power2.out"
      }
    );

    // Animation cho hình ảnh (Chạy 1 lần khi mở Dialog)
    // Scale nhẹ từ 1.1 về 1
    gsap.fromTo(imageRef.current,
      { scale: 1.1, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: "power2.out" }
    );

  }, { scope: containerRef, dependencies: [mode, open] }); // Chạy lại khi mode hoặc open thay đổi

  const handleSuccess = () => {
    setOpen(false);
  };

  const renderForm = () => {
    switch (mode) {
      case 'login':
        return <LoginForm setMode={setMode} onSuccess={handleSuccess} />;
      case 'register':
        return <RegisterForm setMode={setMode} onSuccess={handleSuccess}/>;
      case 'reset-password':
        return <ForgotPasswordForm setMode={setMode} onSuccess={handleSuccess}/>;
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'login':
        return 'Đăng nhập';
      case 'register':
        return 'Đăng ký';
      case 'reset-password':
        return 'Quên mật khẩu';
      default:
        return null;
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) setMode('login');
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

      {/* Container chính */}
      <DialogContent className="sm:max-w-[850px] p-0 overflow-hidden gap-0">

        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 h-full min-h-[500px]">

          <div className="relative hidden md:block bg-muted overflow-hidden">
            <img
              ref={imageRef}
              src="/images/sidebarlogin.png"
              alt="Login Visual"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-center p-6 md:p-10 bg-background">
            <DialogHeader className="mb-6">
              <DialogTitle className="anim-element text-2xl font-bold tracking-tight">
                {getTitle()}
              </DialogTitle>
              <DialogDescription>
                Vui lòng chọn lựa chọn của bạn
              </DialogDescription>
              <div className="anim-element text-sm text-muted-foreground mt-1">
                {mode === 'login' && "Chào mừng bạn quay trở lại!"}
                {mode === 'register' && "Tạo tài khoản để bắt đầu trải nghiệm."}
                {mode === 'reset-password' && "Nhập email để lấy lại mật khẩu."}
              </div>
            </DialogHeader>

            <div className="anim-element">
              {renderForm()}
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}