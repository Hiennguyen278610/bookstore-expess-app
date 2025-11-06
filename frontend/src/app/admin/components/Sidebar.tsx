"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Book,
  Users,
  Package,
  Layers,
  Building2,
  FileText,
  BarChart3,
} from "lucide-react";

export default function Sidebar({ isOpen }: { isOpen: boolean }) {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    if (path === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(path);
  };

  const getItemClass = (path: string) => {
    const active = isActive(path);
    return `flex items-center gap-3 px-4 py-3 pl-6 transition-all duration-500 rounded-md ${
      active
        ? "bg-[#D1B892] text-[#6B4E2E] shadow-md scale-105"
        : "text-[#6B4E2E] hover:bg-[#D1B892] hover:shadow-sm"
    } ${isOpen ? "" : "justify-center"}`;
  };

  const getIconClass = (path: string) => {
    const active = isActive(path);
    return `w-5 h-5 flex-shrink-0 transition-all duration-300 ${
      active ? "text-[#6B4E2E] scale-110" : "text-[#6B4E2E]"
    }`;
  };

  const getTextClass = (path: string) => {
    const active = isActive(path);
    return `whitespace-nowrap transition-all duration-500 ${
      active ? "font-semibold" : "font-normal"
    } ${
      isOpen
        ? "opacity-100 delay-300 max-w-[200px]"
        : "opacity-0 max-w-0 overflow-hidden"
    }`;
  };

  return (
    <aside
      className={`bg-[#F1EEE3] h-screen shadow-md fixed top-0 left-0 transition-all duration-500 z-50 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-center bg-[#7B6050] overflow-hidden">
        {isOpen ? (
          <h1
            className={`font-bold text-white text-xl tracking-wider transition-opacity duration-300 ${
              isOpen ? "opacity-100 delay-150" : "opacity-0"
            }`}
          >
            BOOKSTORE
          </h1>
        ) : (
          <div className="w-10 h-10 bg-[#D1B892] rounded-lg flex items-center justify-center transition-all duration-300">
            <Book className="w-6 h-6 text-[#6B4E2E]" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="mt-3 space-y-1 px-2">
        <Link href="/admin" className={getItemClass("/admin")}>
          <BarChart3 className={getIconClass("/admin")} />
          <span className={getTextClass("/admin")}>Thống kê</span>
        </Link>

        <Link href="/admin/users" className={getItemClass("/admin/users")}>
          <Users className={getIconClass("/admin/users")} />
          <span className={getTextClass("/admin/users")}>Người dùng</span>
        </Link>

        <Link href="/admin/books" className={getItemClass("/admin/books")}>
          <Book className={getIconClass("/admin/books")} />
          <span className={getTextClass("/admin/books")}>Sách</span>
        </Link>

        <Link
          href="/admin/categories"
          className={getItemClass("/admin/categories")}
        >
          <Layers className={getIconClass("/admin/categories")} />
          <span className={getTextClass("/admin/categories")}>Danh mục</span>
        </Link>

        <Link href="/admin/authors" className={getItemClass("/admin/authors")}>
          <Users className={getIconClass("/admin/authors")} />
          <span className={getTextClass("/admin/authors")}>Tác giả</span>
        </Link>

        <Link
          href="/admin/publishers"
          className={getItemClass("/admin/publishers")}
        >
          <Building2 className={getIconClass("/admin/publishers")} />
          <span className={getTextClass("/admin/publishers")}>
            Nhà xuất bản
          </span>
        </Link>

        <Link href="/admin/orders" className={getItemClass("/admin/orders")}>
          <Package className={getIconClass("/admin/orders")} />
          <span className={getTextClass("/admin/orders")}>Đơn hàng</span>
        </Link>

        <Link
          href="/admin/suppliers"
          className={getItemClass("/admin/suppliers")}
        >
          <Building2 className={getIconClass("/admin/suppliers")} />
          <span className={getTextClass("/admin/suppliers")}>
            Nhà cung cấp
          </span>
        </Link>

        <Link
          href="/admin/supply-receipts"
          className={getItemClass("/admin/supply-receipts")}
        >
          <FileText className={getIconClass("/admin/supply-receipts")} />
          <span className={getTextClass("/admin/supply-receipts")}>
            Phiếu nhập hàng
          </span>
        </Link>
      </nav>
    </aside>
  );
}