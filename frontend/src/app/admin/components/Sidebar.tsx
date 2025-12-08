"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Book,
  Users,
  Package,
  Layers,
  Building2,
  FileText,
  BarChart3,
  User,
  Home,
  LogOut,
} from "lucide-react";
import MyAccount from "./MyAccount";

export default function Sidebar({ isOpen }: { isOpen: boolean }) {
  const pathname = usePathname();
  const [showMyAccount, setShowMyAccount] = useState(false);

  const isActive = (path: string) => {
    if (path === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(path);
  };

  const getItemClass = (path: string) => {
    const active = isActive(path);
    return `flex items-center gap-3 px-4 py-3 pl-6 transition-all duration-300 rounded-lg relative group no-underline ${active
      ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md scale-105 border-l-4 border-emerald-400"
      : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 hover:scale-102 hover:shadow-sm hover:border-l-4 hover:border-emerald-200"
      } ${isOpen ? "" : "justify-center"}`;
  };

  const getIconClass = (path: string) => {
    const active = isActive(path);
    return `w-5 h-5 flex-shrink-0 transition-all duration-300 ${active ? "text-white animate-pulse" : "text-gray-500 group-hover:text-emerald-600 group-hover:scale-110"
      }`;
  };

  const getTextClass = (path: string) => {
    const active = isActive(path);
    return `whitespace-nowrap transition-all duration-500 ${active ? "font-semibold" : "font-normal"
      } ${isOpen
        ? "opacity-100 delay-300 max-w-[200px]"
        : "opacity-0 max-w-0 overflow-hidden"
      } group-hover:no-underline`;
  };

  return (
    <aside
      className={`bg-white h-screen shadow-lg fixed top-0 left-0 transition-all duration-500 z-50 border-r border-gray-200 ${isOpen ? "w-64" : "w-20"
        }`}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-center bg-emerald-700 overflow-hidden border-b border-emerald-600">
        {isOpen ? (
          <Image
            src="/images/logo.webp"
            alt="Logo"
            width={150}
            height={40}
            className="transition-opacity duration-300"
          />
        ) : (
          <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center transition-all duration-300">
            <Book className="w-6 h-6 text-white" />
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

      {/* Bottom Actions */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white px-2 py-3 space-y-1">
        <button
          onClick={() => setShowMyAccount(true)}
          className={`w-full flex items-center gap-3 px-4 py-3 pl-6 transition-all duration-300 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-emerald-700 ${isOpen ? "" : "justify-center"}`}
        >
          <User className="w-5 h-5 flex-shrink-0 text-gray-500" />
          <span className={`whitespace-nowrap transition-all duration-500 ${isOpen ? "opacity-100 delay-300 max-w-[200px]" : "opacity-0 max-w-0 overflow-hidden"}`}>
            Thông tin tài khoản
          </span>
        </button>

        <Link
          href="/"
          className={`flex items-center gap-3 px-4 py-3 pl-6 transition-all duration-300 rounded-lg text-orange-600 hover:bg-orange-50 hover:text-orange-700 ${isOpen ? "" : "justify-center"}`}
        >
          <Home className="w-5 h-5 flex-shrink-0 text-orange-500" />
          <span className={`whitespace-nowrap transition-all duration-500 ${isOpen ? "opacity-100 delay-300 max-w-[200px]" : "opacity-0 max-w-0 overflow-hidden"}`}>
            Trở về trang chủ
          </span>
        </Link>

        <button
          onClick={() => {
            // TODO: Add logout logic
            console.log("Đăng xuất");
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 pl-6 transition-all duration-300 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 ${isOpen ? "" : "justify-center"}`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0 text-red-500" />
          <span className={`whitespace-nowrap transition-all duration-500 ${isOpen ? "opacity-100 delay-300 max-w-[200px]" : "opacity-0 max-w-0 overflow-hidden"}`}>
            Đăng xuất
          </span>
        </button>
      </div>

      {/* MyAccount Modal */}
      <MyAccount isOpen={showMyAccount} onClose={() => setShowMyAccount(false)} />
    </aside>
  );
}