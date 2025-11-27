"use client";

import Image from "next/image";
import { SearchIcon, Star, User2 } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import CartIcon from "./common/CartIcon";
import SearchInput from "./common/SearchInput";
import Link from "next/link";
import { AuthDialog } from "@/components/auth-dialog";

export default function UserNavbar() {
  return (
    <nav className="fixed z-50 w-full border-b border-amber-50 shadow-sm bg-white">
      {/* Mobile */}
      <div className="w-full flex justify-center p-4 lg:hidden">
        <div className="w-full grid grid-cols-[2fr_1fr] gap-2 items-center">
          <div className="flex gap-3">
            {/* Sidebar trigger */}
            <div className="flex justify-start items-center ml-2">
              <SidebarTrigger className="size-9" />
            </div>
            {/* Logo */}
            <Link className="flex justify-center" href="/">
              <Image
                src="/images/logo.webp"
                alt="Logo"
                width={120}
                height={120}
                className="cursor-pointer"
              />
            </Link>
          </div>

          {/* Icons */}
          <div className="flex justify-end items-center gap-3 mr-2">
            <div>
              <SearchIcon size={24} />
            </div>

            <div className="border-x-1 px-2 py-2 border-gray-300">
                <AuthDialog>
                    <User2 size={24} />
                </AuthDialog>
            </div>

            <CartIcon />
          </div>
        </div>
      </div>

      {/**Desktop */}
      <div className="hidden lg:flex justify-center items-center md:gap-6 lg:gap-12 py-4 w-full px-4">
        <Link href="/" className="flex justify-center">
          <Image
            src="/images/logo.webp"
            alt="Logo"
            width={150}
            height={150}
            className="cursor-pointer w-32 lg:w-36 h-auto"
          />
        </Link>

        <SearchInput />

        <div className="flex gap-x-5">
          <Link
            href="about"
            className="flex flex-col justify-center items-center gap-[1px] pl-5 border-l border-gray-300 text-gray-800 hover:text-primary transition-colors"
          >
            <Star size={20} className="text-gray-700" />
            <h3 className="text-lg">Giới thiệu</h3>
          </Link>

          <AuthDialog>
              <div
                className="flex flex-col justify-center items-center gap-[1px] pl-5 border-l border-gray-300 text-gray-800 hover:text-primary transition-colors cursor-pointer"
              >
                <User2 size={20} className="text-gray-700" />
                <h3 className="text-lg">Tài khoản</h3>
              </div>
          </AuthDialog>

          <Link
            href="/cart"
            className="flex flex-col justify-center items-center gap-[1px] pl-5 border-l border-gray-300 text-gray-800 hover:text-primary transition-colors"
          >
            <CartIcon />
            <h3 className="text-lg">Giỏ hàng</h3>
          </Link>
        </div>
      </div>
    </nav>
  );
}
