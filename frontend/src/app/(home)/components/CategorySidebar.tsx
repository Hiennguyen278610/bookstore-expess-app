"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { categoryServices } from "@/services/categoryServices";
import { SquareMenu } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";

export default function CategorySidebar() {
  const { data: categories, isLoading } = useSWR(
    "/categories",
    categoryServices.getAllCategories
  );

  if (isLoading || !categories) {
    return (
      <div className="border-1 border-gray-300 w-full bg-white shadow hidden lg:block">
        <div className="space-y-2">
          <Skeleton className="h-10 w-1/3 mb-4" />

          {[...Array(8)].map((_, index) => (
            <div key={index} className="flex items-center space-x-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-6 flex-1" />
            </div>
          ))}

          <Skeleton className="h-12 w-full mt-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="border-1 border-gray-300 overflow-hidden w-full bg-white shadow hidden lg:block">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#34d399] text-white font-bold text-sm uppercase">
        <SquareMenu size={18} />
        <span className="line-clamp-1">Danh mục sản phẩm</span>
      </div>

      {/* Category list */}
      <ul className="divide-y divide-gray-300">
        {categories.map((item, _id) => {
          return (
            <Link
              href={`/collections/${item.slug}`}
              key={_id}
              className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors duration-200 no-underline"
            >
              <span className="text-sm line-clamp-1">{item.name}</span>
            </Link>
          );
        })}
      </ul>
    </div>
  );
}
