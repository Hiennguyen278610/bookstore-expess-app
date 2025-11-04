"use client";

import { categories } from "@/constants/user.index";
import { SquareMenu } from "lucide-react";

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
            <li
              key={index}
              className="flex items-center gap-3 px-4 py-2 hover:bg-green-50 cursor-pointer text-clamp-1"
            >
              <Icon size={24} className="text-green-600"/>
              <span className="text-sm line-clamp-1">{item.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
