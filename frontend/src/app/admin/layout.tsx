"use client";
import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { toast, Toaster } from 'sonner';
import { useUser } from '@/services/authservices';
import { useRouter } from 'next/navigation';


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const {user, isLoading} = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        toast.error("Vui lòng đăng nhập để truy cập");
        router.push("/");
        return;
      }
      if (user.data.role !== "admin") {
        toast.warning("Bạn không có quyền truy cập trang này");
        router.push("/");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.data.role !== "admin") {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        Loading...
      </div>
    );
  }


  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar isOpen={isOpen} />
      <div
        className={`flex-1 transition-all duration-700 ${isOpen ? "ml-64" : "ml-18"
          }`}
      >
        <Navbar toggleSidebar={() => setIsOpen(!isOpen)} isOpen={isOpen} />
        <main className="p-6 mt-16 transition-all duration-700 bg-gray-100">
          {children}
        </main>
        <Toaster />
      </div>
    </div>
  );
}
