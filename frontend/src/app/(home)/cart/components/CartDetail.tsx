"use client";

import React, { useEffect } from "react";
import CartProduct from "./CartProduct";
import { useCartStore } from "@/stores/useCartStore";

const CartDetail = () => {
  const {
    cartItems,
    cartCount,
    loading,
    fetchCart,
    updateCartItem,
    removeCartItem,
  } = useCartStore();

  // Load cart khi mở component
  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <p className="text-gray-600 text-center">Đang tải giỏ hàng...</p>
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
        {cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <div
              key={index}
              className="border-b border-gray-100 pb-4 last:border-b-0"
            >
              <CartProduct
                quantity={item.quantity}
                bookId={item.bookId}
                onIncrease={() => updateCartItem(item._id, item.quantity + 1)}
                onDecrease={() =>
                  updateCartItem(item._id, Math.max(1, item.quantity - 1))
                }
                onInputQuantity={(amount: number) =>
                  updateCartItem(item._id, amount)
                }
                onRemove={() => removeCartItem(item._id)}
              />
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">Giỏ hàng của bạn đang trống</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDetail;
