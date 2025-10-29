"use client";
import Link from "next/link";
import { Home, Book, Users, Package, Layers } from "lucide-react";

export default function Sidebar({ isOpen }: { isOpen: boolean }) {
  const item = "flex items-center gap-3 px-5 py-2 hover:bg-[#D1B892] transition rounded-md text-[#6B4E2E]";
  const icon = "w-5 h-5 text-[#6B4E2E]";

  return (
    <aside
      className={`bg-[#F1EEE3] h-screen shadow-md fixed top-0 left-0 transition-all duration-700 ${
        isOpen ? "w-64" : "w-18"
      }`}
    >
      <div className="h-16 flex items-center justify-start  bg-[#7B6050]">
        <h1
          className={`font-bold text-white ml-5 transition-all duration-700 ${
            isOpen ? "text-xl" : "text-sm"
          }`}
        >
          {isOpen ? "BOOK STORE" : "BS"}
        </h1>
      </div>

      <nav className="mt-3 space-y-1">
        <Link href="/admin" className={item}>
          <Home className={icon} />
          {isOpen && <span>Trang chủ</span>}
        </Link>
        <Link href="/admin/books" className={item}>
          <Book className={icon} />
          {isOpen && <span>Sách</span>}
        </Link>
        <Link href="/admin/authors" className={item}>
          <Layers className={icon} />
          {isOpen && <span>Tác giả & Thể loại</span>}
        </Link>
        <Link href="/admin/orders" className={item}>
          <Package className={icon} />
          {isOpen && <span>Đơn hàng</span>}
        </Link>
        <Link href="/admin/users" className={item}>
          <Users className={icon} />
          {isOpen && <span>Người dùng</span>}
        </Link>
        <Link href="/admin/suppliers" className={item}>
          <Package className={icon} />
          {isOpen && <span>Nhà cung cấp</span>}
        </Link>
      </nav>
    </aside>
  );
}
