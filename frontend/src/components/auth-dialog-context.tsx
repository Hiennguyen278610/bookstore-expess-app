"use client";

import { createContext, useContext, useState } from "react";

type Mode = "login" | "register" | "reset-password";

interface AuthDialogContextType {
  open: boolean;
  setOpen: (v: boolean) => void;
  mode: Mode;
  setMode: (m: Mode) => void;
}

const AuthDialogContext = createContext<AuthDialogContextType | null>(null);

export function AuthDialogProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("login");

  return (
    <AuthDialogContext.Provider value={{ open, setOpen, mode, setMode }}>
      {children}
    </AuthDialogContext.Provider>
  );
}

export function useAuthDialog() {
  const ctx = useContext(AuthDialogContext);
  if (!ctx) throw new Error("useAuthDialog must be used inside provider");
  return ctx;
}
