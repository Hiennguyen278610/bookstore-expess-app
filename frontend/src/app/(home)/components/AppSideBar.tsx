"use client";

import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { categories } from "@/constants/user.index";

export function AppSidebar() {
  return (
    <Sidebar className="w-64 bg-white shadow-md border-r border-gray-200">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-700 font-semibold text-md uppercase px-4 py-3 border-b border-gray-200 tracking-wide">
            Danh mục
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="py-2">
              {categories.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild>
                    <Link
                      href="/"
                      className="
                        flex items-center gap-3 px-4 py-5 rounded-lg 
                        text-gray-700 hover:text-green-700
                      "
                    >
                      <item.icon size={18} className="text-green-600" />
                      <span className="font-medium text-md">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
