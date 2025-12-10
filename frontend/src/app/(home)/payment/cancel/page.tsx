'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, ArrowLeft, RefreshCcw, Loader2 } from 'lucide-react';
import { cancelPayment } from '@/services/PaymentService';

const PaymentCancelContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderCode = searchParams.get('orderCode');

  if (!orderCode) {
    return null;
  }
  const res = cancelPayment(orderCode)

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg border-none shadow-xl">
        <CardHeader className="flex flex-col items-center space-y-2 pb-2">
          <div className="relative">
            <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-20"></div>
            <AlertCircle className="w-20 h-20 text-red-500 relative z-10" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 text-center mt-4">
            Thanh toán bị hủy
          </CardTitle>
          <p className="text-gray-500 text-sm text-center max-w-xs">
            Giao dịch đã bị hủy hoặc xảy ra lỗi trong quá trình thanh toán.
          </p>
        </CardHeader>

        <CardContent className="space-y-6 pt-4">
          <div className="bg-red-50 p-4 rounded-lg border border-red-100 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Mã đơn hàng:</span>
              <span className="font-bold text-gray-900">#{orderCode}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Trạng thái:</span>
              <span className="font-bold text-red-600">Đã hủy giao dịch</span>
            </div>
            <div className="text-xs text-red-500 mt-2 italic">
              *Bạn chưa bị trừ tiền cho giao dịch này.
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            variant="outline"
            className="w-full border-gray-300"
            onClick={() => router.push('/')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Về trang chủ
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

const PaymentCancelPage = () => (
  <Suspense fallback={<div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin w-8 h-8 text-gray-500" /></div>}>
    <PaymentCancelContent />
  </Suspense>
);

export default PaymentCancelPage;