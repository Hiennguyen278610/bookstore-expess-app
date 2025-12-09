'use client';

import React, { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Home, ShoppingBag, Loader2 } from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';

const PaymentReturnContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const clearCart = useCartStore((state) => state.clearCart);

  const status = searchParams.get('status');
  const orderCode = searchParams.get('orderCode');

  useEffect(() => {
    // Nếu trạng thái là PAID, thực hiện xóa giỏ hàng
    if (status === 'PAID') {
      clearCart();
    }
  }, [status, clearCart]);

  // Nếu không phải trạng thái PAID (người dùng cố tình truy cập link sai)
  if (status !== 'PAID') {
    return (
      <Card className="w-full max-w-md mx-auto mt-20 border-red-200 shadow-lg">
        <CardContent className="pt-6 text-center space-y-4">
          <div className="text-red-500 font-bold text-lg">Dữ liệu thanh toán không hợp lệ</div>
          <Button onClick={() => router.push('/')}>Về trang chủ</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg border-none shadow-xl">
        <CardHeader className="flex flex-col items-center space-y-2 pb-2">
          <CheckCircle className="w-20 h-20 text-green-500 animate-in zoom-in duration-300" />
          <CardTitle className="text-2xl font-bold text-gray-900 text-center uppercase tracking-wide">
            Thanh toán thành công!
          </CardTitle>
          <p className="text-gray-500 text-sm">Cảm ơn bạn đã mua sắm tại cửa hàng</p>
        </CardHeader>

        <CardContent className="space-y-6 pt-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-100 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Mã đơn hàng:</span>
              <span className="font-bold text-gray-900">#{orderCode}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Trạng thái:</span>
              <span className="font-bold text-green-600">Đã thanh toán</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Phương thức:</span>
              <span className="font-medium text-gray-900">PayOS (QR Code)</span>
            </div>
          </div>
          <p className="text-center text-sm text-gray-500 px-4">
            Đơn hàng của bạn đang được xử lý và sẽ sớm được giao đến địa chỉ đăng ký.
          </p>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            className="w-full bg-gray-900 hover:bg-gray-800"
            onClick={() => router.push('/')}
          >
            <Home className="w-4 h-4 mr-2" /> Về trang chủ
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

// Cần bọc Suspense vì useSearchParams gây lỗi khi build static
const PaymentReturnPage = () => (
  <Suspense fallback={<div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin w-8 h-8 text-gray-500" /></div>}>
    <PaymentReturnContent />
  </Suspense>
);

export default PaymentReturnPage;