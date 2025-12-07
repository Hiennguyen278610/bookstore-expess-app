"use client";
import { EllipsisVertical } from "lucide-react";

export default function Navbar({
  toggleSidebar,
  isOpen,
}: {
  toggleSidebar: () => void;
  isOpen: boolean;
}) {
  return (
    <div
      className={`shadow-sm h-16 bg-white flex items-center px-6 fixed top-0 right-0 z-10 transition-all duration-700 border-b border-gray-200 ${
        isOpen ? "left-64" : "left-20"
      }`}
    >
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-lg bg-gray-100 hover:bg-emerald-100 transition-all duration-200"
      >
        <EllipsisVertical className="text-gray-700" />
      </button>
    </div>
  );
}