"use client";
import { fetcher } from "@/lib/utils";
import { SWRConfig } from "swr";

export function SWRProvider({
                              children,
                            }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SWRConfig
      value={{
        fetcher: fetcher,
        revalidateOnFocus: false, // không refetch khi đổi tab/quay lại tab (tự comment cho nhớ đéo phải AI)
        revalidateOnReconnect: false, // không refetch khi mạng reconnect (tự comment cho nhớ đéo phải AI)
        refreshInterval: 0, // không tự động refetch (tự comment cho nhớ đéo phải AI)
        errorRetryCount: 0, // không retry khi fetch lỗi (tự comment cho nhớ đéo phải AI)
      }}
    >
      {children}
    </SWRConfig>
  );
}