"use client";

import { categories } from "@/constants/user.index";
import { SquareMenu } from "lucide-react";
import Link from "next/link";

export default function CategorySidebar() {
  return (
    <div className="border-1 border-gray-300 overflow-hidden w-full bg-white shadow hidden lg:block">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#34d399] text-white font-bold text-sm uppercase">
        <SquareMenu size={18} />
        <span className="line-clamp-1">Danh mục sản phẩm</span>
      </div>

      {/* Category list */}
      <ul className="divide-y divide-gray-300">
        {categories.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link
              href={`/collections/${item.slug || ''}`}
              key={index}
              className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors duration-200 no-underline"
            >
              <Icon size={24} className="text-green-600" />
              <span className="text-sm line-clamp-1">{item.label}</span>
            </Link>
          );
        })}
      </ul>
    </div>
  );
}
