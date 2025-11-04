"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import Navbar from "./components/Navbar";
import { AppSidebar } from "./components/AppSideBar";


export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="md:hidden">
          <AppSidebar />
        </div>
      <div className="w-full flex flex-col">
        <Navbar />
        <main className="mt-20 flex justify-center w-full overflow-hidden">{children}</main>
      </div>
    </SidebarProvider>
  );
}
