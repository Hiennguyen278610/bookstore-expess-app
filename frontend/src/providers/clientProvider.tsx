"use client";

import { AuthDialogProvider } from "@/components/auth-dialog-context";
import { SWRProvider } from "@/components/provider/swr-provider";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthDialogProvider>
      <SWRProvider>{children}</SWRProvider>
    </AuthDialogProvider>
  );
}
