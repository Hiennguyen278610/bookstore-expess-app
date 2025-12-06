"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import Navbar from "../../components/customer/Navbar";
import { AppSidebar } from "./components/AppSideBar";
import Footer from "../../components/customer/Footer";
import { CartProvider } from "./context/CartContext";
import { Toaster } from '@/components/ui/sonner';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <SidebarProvider>
        <div className="md:hidden">
          <AppSidebar />
        </div>
        <div className="w-full flex flex-col">
          <Navbar />
          <main className="mt-2 w-full max-w-[1200px] mx-auto px-4">
            {children}
          </main>
          <Toaster />
          <Footer />
        </div>
      </SidebarProvider>
    </CartProvider>
  );
}
