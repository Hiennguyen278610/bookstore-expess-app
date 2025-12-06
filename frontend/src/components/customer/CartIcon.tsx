// components/common/CartIcon.tsx
"use client";
import { ShoppingCart } from "lucide-react";

interface CartIconProps {
  quantity?: number;
}

export default function CartIcon({ quantity = 0 }: CartIconProps) {
  return (
    <div 
        className="relative inline-block cursor-pointer"
    >
      <ShoppingCart size={24} className="text-gray-800" />
        <div
          className="absolute -top-1 -right-1 bg-red-500 text-white text-xs 
            w-4 h-4 rounded-full flex items-center justify-center"
        >
          {quantity}
        </div>
    </div>
  );
}
