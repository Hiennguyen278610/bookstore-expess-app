"use client";

import React, { useEffect, useRef } from "react";
import CartProduct from "./CartProduct";
import { useCartStore } from "@/stores/useCartStore";

const CartDetail = () => {
  const cart = useCartStore((s) => s.cart);
  const loading = useCartStore((s) => s.loading);

  const fetchCart = useCartStore((s) => s.fetchCart);
  const updateCartItem = useCartStore((s) => s.updateCartItem);
  const removeCartItem = useCartStore((s) => s.removeCartItem);

  const fetched = useRef(false);

  useEffect(() => {
    if (!fetched.current) {
      fetchCart();
      fetched.current = true;
    }
  }, [fetchCart]);

  const cartCount = cart?.totalQuantity ?? 0;
  const items = cart?.items ?? [];

  // Loading state
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <p className="text-gray-600 text-center">Đang tải giỏ hàng...</p>
      </div>
    );
  }

  // Không có cart → giỏ trống
  if (!cart || items.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <p className="text-gray-500 text-center text-lg">
          Giỏ hàng của bạn đang trống
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Giỏ hàng</h3>
        <h4 className="text-gray-600 font-medium">{cartCount} sản phẩm</h4>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item._id} className="border-b pb-4 last:border-b-0">
            <CartProduct
              bookId={item.bookId}
              quantity={item.quantity}
              onIncrease={() => updateCartItem(item._id, item.quantity + 1)}
              onDecrease={() =>
                updateCartItem(item._id, Math.max(1, item.quantity - 1))
              }
              onInputQuantity={(amount) =>
                updateCartItem(item._id, amount)
              }
              onRemove={() => removeCartItem(item._id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CartDetail;
