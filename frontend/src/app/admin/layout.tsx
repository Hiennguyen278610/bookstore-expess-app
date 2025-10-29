"use client";
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex bg-[#E2D4B7] min-h-screen">
      <Sidebar isOpen={isOpen} />
      <div
        className={`flex-1 transition-all duration-700 ${
          isOpen ? "ml-64" : "ml-18"
        }`}
      >
        <Navbar toggleSidebar={() => setIsOpen(!isOpen)} isOpen={isOpen} />
        <main className="p-6 mt-16 transition-all duration-700">{children}</main>
      </div>
    </div>
  );
}
