"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAuthDialog } from "./auth-dialog-context";

import { LoginForm } from "@/components/login-form";
import { RegisterForm } from "@/components/register-form";
import { ForgotPasswordForm } from "@/components/forgot-password-form";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

export function AuthDialogGlobal() {
  const { open, setOpen, mode, setMode } = useAuthDialog();

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // GSAP animation
  useGSAP(() => {
    if (!open) return;

    gsap.fromTo(
      ".anim-element",
      { y: 20, opacity: 0, filter: "blur(6px)" },
      {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.45,
        stagger: 0.1,
        ease: "power2.out",
      }
    );

    gsap.fromTo(
      imageRef.current,
      { scale: 1.1, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: "power2.out" }
    );
  }, [open, mode]);

  const handleSuccess = () => {
    setOpen(false);
  };

  const renderForm = () => {
    switch (mode) {
      case "login":
        return <LoginForm setMode={setMode} onSuccess={handleSuccess} />;
      case "register":
        return <RegisterForm setMode={setMode} onSuccess={handleSuccess} />;
      case "reset-password":
        return <ForgotPasswordForm setMode={setMode} onSuccess={handleSuccess} />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[850px] p-0 overflow-hidden gap-0">

        <div
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 h-full min-h-[500px]"
        >
          {/* --- Left image --- */}
          <div className="relative hidden md:block bg-muted overflow-hidden">
            <img
              ref={imageRef}
              src="/images/sidebarlogin.png"
              alt="Visual"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          {/* --- Right form --- */}
          <div className="flex flex-col justify-center p-6 md:p-10 bg-background">
            <DialogHeader className="mb-6">
              <DialogTitle className="anim-element text-2xl font-bold">
                {mode === "login"
                  ? "Đăng nhập"
                  : mode === "register"
                  ? "Đăng ký"
                  : "Quên mật khẩu"}
              </DialogTitle>

              <DialogDescription className="anim-element">
                Vui lòng chọn lựa chọn của bạn
              </DialogDescription>

              <p className="anim-element text-sm text-muted-foreground mt-1">
                {mode === "login" && "Chào mừng bạn quay trở lại!"}
                {mode === "register" && "Tạo tài khoản để bắt đầu trải nghiệm."}
                {mode === "reset-password" &&
                  "Nhập email để lấy lại mật khẩu của bạn."}
              </p>
            </DialogHeader>

            <div className="anim-element">{renderForm()}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
