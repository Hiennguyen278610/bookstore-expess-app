"use client";
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { Toaster } from "sonner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar isOpen={isOpen} />
      <div
        className={`flex-1 transition-all duration-700 ${
          isOpen ? "ml-64" : "ml-18"
        }`}
      >
        <Navbar toggleSidebar={() => setIsOpen(!isOpen)} isOpen={isOpen} />
        <Toaster richColors />
        <main className="p-6 mt-16 transition-all duration-700 bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
}
