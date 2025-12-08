"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import CheckoutItem from "@/components/checkout/CheckoutItem"; // Component tạo ở bước 2
import { ArrowLeft, MapPin, ReceiptText } from "lucide-react";
import { CartItem } from "@/types/cart.type";
import { useCartStore } from "@/stores/useCartStore";
import { orderServices } from "@/services/orderServices";

const CheckoutPage = () => {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const clearCart = useCartStore((s) => s.clearCart);

  // 1. Load dữ liệu từ LocalStorage khi vào trang
  useEffect(() => {
    const data = localStorage.getItem('checkout_session');
    if (data) {
      const parsed = JSON.parse(data);
      setItems(parsed.items);
      setTotalPrice(parsed.totalPrice);
    } else {
      router.push('/');
    }
  }, [router]);

  // 2. Hàm gọi API tạo đơn hàng thật sự
  const handleConfirmOrder = async () => {
    try {
      setLoading(true);

      // Gọi API tạo đơn
      const order = await orderServices.createOrder(items);
      console.log(order)
      // Xóa LocalStorage và Clear giỏ hàng (nếu muốn)
      localStorage.removeItem('checkout_session');
      await clearCart()

      toast.success("Đặt hàng thành công!");

      router.push(`/orders/${order._id}`);

    } catch (err) {
      toast.error("Tạo đơn hàng thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-200 rounded-full transition">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Xác nhận đơn hàng</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cột trái */}
          <div className="lg:col-span-2 space-y-6">
            {/* Danh sách sản phẩm */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="flex items-center gap-2 font-semibold text-lg text-gray-800 mb-4 border-b pb-2">
                <ReceiptText className="w-5 h-5 text-orange-600" /> Kiểm tra sản phẩm
              </h3>
              <div>
                {items.map((item) => (
                  <CheckoutItem
                    key={item.bookId}
                    bookId={item.bookId}
                    quantity={item.quantity}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Cột phải: Tổng tiền & Action */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm sticky top-6">
              <h3 className="font-bold text-lg text-gray-800 mb-4">Tổng cộng</h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính:</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển:</span>
                  <span className="text-green-600">Miễn phí</span>
                </div>
                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="font-bold text-gray-800">Tổng thanh toán:</span>
                  <span className="text-2xl font-bold text-red-600">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleConfirmOrder}
                disabled={loading}
                className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all
                  ${loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700 hover:shadow-xl transform hover:-translate-y-0.5"
                }`}
              >
                {loading ? "Đang xử lý..." : "Xác nhận đặt hàng"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;