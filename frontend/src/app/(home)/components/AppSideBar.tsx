"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
import useSWR from "swr";
import { categoryServices } from "@/services/categoryServices";
import { Skeleton } from "@/components/ui/skeleton";

export function AppSidebar() {
  const { data: categories, isLoading } = useSWR(
    "/categories",
    categoryServices.getAllCategories
  );

  const pathname = usePathname();

  const isCategoryActive = (slug: string) => {
    return pathname?.includes(`/collections/${slug}`);
  };

  if (isLoading || !categories) {
    return (
      <div className="w-full bg-white border-t border-gray-200 px-4 py-3">
        <Skeleton className="h-6 w-40 mb-3" />
        <div className="space-y-1">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <Sidebar className="w-full bg-white border-t border-gray-200">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-3.5 text-lg font-semibold text-gray-900">
            Danh mục
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem key="about">
                <SidebarMenuButton asChild>
                  <Link
                    href={`/about`}
                    className={`
                          block px-4 py-5 text-md
                          ${
                            pathname?.includes(`/about`)
                              ? "text-green-700 bg-green-100 font-medium"
                              : "text-gray-700"
                          }
                          active:bg-gray-100
                          border-b border-gray-100
                        `}
                  >
                    {"Giới thiệu"}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {categories.map((item) => {
                const isActive = isCategoryActive(item.slug);

                return (
                  <SidebarMenuItem key={item._id}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={`/collections/${item.slug}`}
                        className={`
                          block px-4 py-5 text-md
                          ${
                            isActive
                              ? "text-green-700 bg-green-100 font-medium"
                              : "text-gray-700"
                          }
                          active:bg-gray-100
                          border-b border-gray-100
                        `}
                      >
                        {item.name}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
