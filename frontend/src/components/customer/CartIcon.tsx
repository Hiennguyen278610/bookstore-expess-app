// components/common/CartIcon.tsx
"use client";
import { useCartStore } from "@/stores/useCartStore";
import { ShoppingCart } from "lucide-react";
import { useEffect } from "react";

export default function CartIcon() {
  const cart = useCartStore((s) => s.cart);
  const fetchCart = useCartStore((s) => s.fetchCart);

  useEffect(() => {
    if (!cart) {
      fetchCart();
    }
  }, []);
  return (
    <div className="relative inline-block cursor-pointer">
      <ShoppingCart size={24} className="text-gray-800" />
      <div
        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs 
            w-4 h-4 rounded-full flex items-center justify-center"
      >
        {cart?.totalQuantity || 0}
      </div>
    </div>
  );
}
