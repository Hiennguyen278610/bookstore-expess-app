"use client";

import { useUser } from "@/services/authservices";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";

// Import các components con
import { AccountSidebar } from "@/components/account/account-sidebar";
import { ProfileTab } from "@/components/account/profile-tab";
import { AddressTab } from "@/components/account/address-tab";
import { OrdersTab } from "@/components/account/orders-tab";
import { PasswordTab } from "@/components/account/password-tab";

export default function AccountPage() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div className="h-[50vh] flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  }

  if (!isLoading && !user) {
    redirect("/");
    return null;
  }

  return (
    <div className="bg-gray-50/40 min-h-screen pb-20 md:pb-12">
      <div className="container mx-auto pt-6 md:pt-10 px-4 md:px-6 max-w-7xl">

        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Quản lý tài khoản</h1>
          <p className="text-gray-500 text-sm mt-1">Quản lý thông tin cá nhân, đơn hàng và bảo mật</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">

            {/* Sidebar */}
            <AccountSidebar />

            {/* Content Area */}
            <div className="flex-1 w-full min-w-0 space-y-6">
              <TabsContent value="profile" className="mt-0">
                <ProfileTab user={user} />
              </TabsContent>

              <TabsContent value="address" className="mt-0">
                <AddressTab />
              </TabsContent>

              <TabsContent value="orders" className="mt-0">
                <OrdersTab />
              </TabsContent>

              <TabsContent value="password" className="mt-0">
                <PasswordTab />
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}