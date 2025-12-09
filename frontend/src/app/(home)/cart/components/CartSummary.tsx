"use client";

import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/stores/useCartStore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useState } from 'react';

const CartSummary = () => {
  const router = useRouter();
  const cart = useCartStore(s => s.cart)
  const [loading, setLoading] = useState(false);

  const handleGoToCheckout = () => {
    if (!cart || cart.items.length === 0) {
      toast.error('Giỏ hàng đang trống!');
      return;
    }

    const checkoutData = {
      items: cart.items,
      totalPrice: cart.totalPrice
    };

    localStorage.setItem('checkout_session', JSON.stringify(checkoutData));

    setLoading(true);
    router.push('/orders');
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 h-fit my-auto">
      <h3 className="text-xl lg:text-2xl font-bold text-gray-800 border-b border-gray-200 pb-4 mb-4">
        Thông tin đơn hàng
      </h3>

      <div className="text-lg mb-4 border-b border-gray-200 pb-4 flex justify-between items-center">
        <h3 className="font-semibold text-gray-700">Tổng tiền:</h3>
        <h3 className="text-red-600 font-bold text-xl">{cart ? formatPrice(cart.totalPrice) : 0}</h3>
      </div>

      <p className="text-gray-500 text-sm mb-6">Phí vận chuyển sẽ được tính ở bước tiếp theo.</p>

      <button
        onClick={handleGoToCheckout}
        disabled={loading || !cart || cart.items.length === 0}
        className={`bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 
          p-4 text-white font-semibold w-full rounded-xl mt-4 transition-all duration-300 
          transform hover:scale-[1.02] shadow-lg hover:shadow-xl cursor-pointer flex justify-center items-center
          ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
      >
        {loading ? "Đang xử lý..." : "Tiến hành đặt hàng"}
      </button>
    </div>
  )
}

export default CartSummary