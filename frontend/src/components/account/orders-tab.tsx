"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PackageOpen } from "lucide-react";

export function OrdersTab() {
  return (
    <Card className="border-none shadow-none bg-transparent lg:bg-white lg:border lg:shadow-sm">
      <CardHeader className="px-0 lg:px-6 pt-0 lg:pt-6">
        <CardTitle className="text-xl">Lịch sử đơn hàng</CardTitle>
        <CardDescription>Xem lại các đơn hàng bạn đã đặt</CardDescription>
      </CardHeader>
      <CardContent className="px-0 lg:px-6 pb-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm lg:border-dashed lg:shadow-none min-h-[300px] flex flex-col items-center justify-center p-8 text-center">
          <div className="bg-gray-50 p-4 rounded-full mb-4">
            <PackageOpen className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Chưa có đơn hàng nào</h3>
          <p className="text-gray-500 text-sm max-w-xs mx-auto mt-2 mb-6">
            Bạn chưa mua sản phẩm nào. Hãy dạo một vòng cửa hàng nhé!
          </p>
          <Button variant="default">Mua sắm ngay</Button>
        </div>
      </CardContent>
    </Card>
  );
}