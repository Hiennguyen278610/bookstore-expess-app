"use client";

import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, MapPin, ShoppingBag, KeyRound } from "lucide-react";

export function AccountSidebar() {
  return (
    <aside className="w-full lg:w-72 shrink-0 sticky top-0 z-30 lg:static">
      <div className="bg-white/95 backdrop-blur-sm lg:bg-white rounded-none lg:rounded-xl border-b lg:border shadow-sm lg:shadow-sm -mx-4 px-4 lg:mx-0 lg:px-3 py-3 lg:py-4">
        <TabsList className="flex flex-row lg:flex-col h-auto bg-transparent p-0 gap-2 overflow-x-auto no-scrollbar w-full justify-start">

          <TabsTrigger
            value="profile"
            className="flex-shrink-0 lg:w-full justify-start gap-3 px-4 py-3 text-sm font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-full lg:rounded-lg transition-all border border-transparent hover:bg-gray-100"
          >
            <User size={18} />
            <span>Hồ sơ cá nhân</span>
          </TabsTrigger>

          <TabsTrigger
            value="address"
            className="flex-shrink-0 lg:w-full justify-start gap-3 px-4 py-3 text-sm font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-full lg:rounded-lg transition-all border border-transparent hover:bg-gray-100"
          >
            <MapPin size={18} />
            <span>Sổ địa chỉ</span>
          </TabsTrigger>

          <TabsTrigger
            value="orders"
            className="flex-shrink-0 lg:w-full justify-start gap-3 px-4 py-3 text-sm font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-full lg:rounded-lg transition-all border border-transparent hover:bg-gray-100"
          >
            <ShoppingBag size={18} />
            <span>Đơn mua</span>
          </TabsTrigger>

          <TabsTrigger
            value="password"
            className="flex-shrink-0 lg:w-full justify-start gap-3 px-4 py-3 text-sm font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-full lg:rounded-lg transition-all border border-transparent hover:bg-gray-100"
          >
            <KeyRound size={18} />
            <span>Đổi mật khẩu</span>
          </TabsTrigger>
        </TabsList>
      </div>
    </aside>
  );
}