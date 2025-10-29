"use client";
import { EllipsisVertical, User,ChevronDown } from "lucide-react";

export default function Navbar({
  toggleSidebar,
  isOpen,
}: {
  toggleSidebar: () => void;
  isOpen: boolean;
}) {
  return (
    <div
      className={`shadow h-16 bg-[#F9F6EC] shadow flex items-center justify-between px-6 fixed top-0 right-0 z-10 transition-all duration-700 ${
        isOpen ? "left-64" : "left-18"
      }`}
    >
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-md bg-[#E2D4B7] hover:bg-[#D1B892] transition"
      >
        <EllipsisVertical className="text-[#6B4E2E]" />
      </button>
      <div className=" shadow w-15 h-10 p-2 rounded-md bg-[#E2D4B7] hover:bg-[#D1B892] transition flex ">
        <User className="text-[#6B4E2E]" />
        <ChevronDown className="text-[#6B4E2E]" />
      </div>
    </div>
  );
}
