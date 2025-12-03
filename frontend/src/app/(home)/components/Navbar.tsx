"use client";

import Image from 'next/image';
import { LogOut, Star, User2 } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import CartIcon from './common/CartIcon';
import SearchInput from './common/SearchInput';
import Link from 'next/link';
import { AuthDialog } from '@/components/auth-dialog';
import { useUser } from '@/services/authservices';
import { removeJWTfromCookie } from '@/lib/cookies';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function UserNavbar() {
  const { user, mutate } = useUser();
  console.log("User: ", user)

  const handleLogout = async () => {
    await removeJWTfromCookie();
    await mutate(null, false);
    toast.success("Đăng xuất thành công");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 shadow-sm bg-white">

      {/* --- MOBILE LAYOUT (Hiển thị dưới 1024px) --- */}
      <div className="lg:hidden flex flex-col w-full bg-white pb-3">
        {/* Dòng 1: Logo + Actions */}
        <div className="flex items-center justify-between px-4 py-3">
          {/* Trái: Menu + Logo */}
          <div className="flex items-center gap-3">
            <SidebarTrigger className="size-9" />
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/images/logo.webp"
                alt="Logo"
                width={100}
                height={100}
                className="w-24 h-auto"
              />
            </Link>
          </div>

          {/* Phải: Cart + User */}
          <div className="flex items-center gap-4">
            <Link href="/cart">
              <CartIcon />
            </Link>

            {/* Mobile User Dropdown - Bỏ các border bao quanh */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="size-9 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer text-primary">
                    <User2 size={20} />

                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none truncate">{user.data.fullName}</p>
                      <p className="text-xs leading-none text-muted-foreground truncate">{user.data.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    Hồ sơ cá nhân
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    Đơn mua
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <AuthDialog>
                <User2 size={24} className="cursor-pointer text-gray-700" />
              </AuthDialog>
            )}
          </div>
        </div>

        {/* Dòng 2: Search Input Full Width */}
        <div className="px-4 w-full">
          {/* Tái sử dụng SearchInput bạn vừa sửa, nó sẽ tự full width */}
          <SearchInput className="h-10 text-sm" />
        </div>
      </div>


      {/* --- DESKTOP LAYOUT (Giữ nguyên như cũ) --- */}
      <div className="hidden lg:flex justify-between items-center py-4 w-full px-6 max-w-[1400px] mx-auto gap-8">
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/images/logo.webp"
            alt="Logo"
            width={150}
            height={150}
            className="cursor-pointer w-32 lg:w-36 h-auto"
          />
        </Link>

        <div className="flex-1 max-w-xl">
          <SearchInput />
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-6 border-r border-gray-200 pr-6 h-8">
            <Link href="about" className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors font-medium text-sm uppercase tracking-wide">
              <Star size={18} />
              <span>Giới thiệu</span>
            </Link>

            <Link href="/cart" className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors font-medium text-sm uppercase tracking-wide">
              <CartIcon />
              <span>Giỏ hàng</span>
            </Link>
          </div>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 rounded-full border-primary/20 hover:bg-primary/5 hover:text-primary px-4 h-10">
                  <User2 size={18} />
                  <span className="font-semibold max-w-[120px] truncate">
                        {user.data.fullName}
                    </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.data.fullName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.data.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">Hồ sơ cá nhân</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">Đơn mua</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <AuthDialog>
              <Button className="rounded-full px-6 font-semibold shadow-md">
                Đăng nhập
              </Button>
            </AuthDialog>
          )}
        </div>
      </div>
    </nav>
  );
}