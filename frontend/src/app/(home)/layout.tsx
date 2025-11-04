"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import Navbar from "./components/Navbar";
import { AppSidebar } from "./components/AppSideBar";
import Footer from "./components/Footer";

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
        <main className="mt-24 w-full max-w-[1200px] mx-auto px-4">
          {children}
        </main>
        <Footer />
      </div>
    </SidebarProvider>
  );
}
