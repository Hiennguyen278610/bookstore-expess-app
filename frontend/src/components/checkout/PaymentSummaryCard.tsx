"use client";

import React from "react";
import { Control } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Wallet, Truck, QrCode, CheckCircle } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Props {
  control: Control<any>;
  totalAmount: number;
  isEditable: boolean;
  onBack: () => void;
  watchPaymentMethod: string; // Truyền giá trị paymentMethod hiện tại vào để đổi text nút bấm
}

export const PaymentSummaryCard = ({ control, totalAmount, isEditable, onBack, watchPaymentMethod }: Props) => {
  return (
    <div className="sticky top-6 space-y-4">
      <Card className="border-none shadow-md ring-1 ring-gray-200 overflow-hidden">
        <div className="bg-gray-900 text-white p-4">
          <h3 className="font-bold flex items-center gap-2">
            <Wallet className="w-5 h-5" /> Thanh toán
          </h3>
        </div>

        <CardContent className="p-4 space-y-6">
          {/* A. CHỌN PHƯƠNG THỨC THANH TOÁN */}
          <FormField
            control={control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-sm font-semibold text-gray-700">Phương thức thanh toán</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col gap-3"
                    disabled={!isEditable}
                  >
                    {/* COD */}
                    <FormItem className="flex items-start space-x-3 space-y-0 rounded-lg border p-3 hover:bg-gray-50 cursor-pointer has-[:checked]:border-green-500 has-[:checked]:bg-green-50 transition-all">
                      <FormControl>
                        <RadioGroupItem value="COD" className="mt-1" />
                      </FormControl>
                      <FormLabel className="flex-1 cursor-pointer font-normal">
                        <div className="flex items-center gap-2 mb-1">
                          <Truck size={16} className="text-green-600" />
                          <span className="font-semibold text-sm">Thanh toán khi nhận hàng</span>
                        </div>
                        <p className="text-xs text-gray-500">Tiền mặt khi giao hàng</p>
                      </FormLabel>
                    </FormItem>

                    {/* BANK */}
                    <FormItem className="flex items-start space-x-3 space-y-0 rounded-lg border p-3 hover:bg-gray-50 cursor-pointer has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 transition-all">
                      <FormControl>
                        <RadioGroupItem value="BANK" className="mt-1" />
                      </FormControl>
                      <FormLabel className="flex-1 cursor-pointer font-normal">
                        <div className="flex items-center gap-2 mb-1">
                          <QrCode size={16} className="text-blue-600" />
                          <span className="font-semibold text-sm">Chuyển khoản ngân hàng</span>
                        </div>
                        <p className="text-xs text-gray-500">Quét mã QR (PayOS)</p>
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator />

          {/* B. TÍNH TIỀN */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Tạm tính:</span>
              <span>{formatPrice(totalAmount)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Vận chuyển:</span>
              <span className="text-green-600 font-medium">Miễn phí</span>
            </div>
            <div className="flex justify-between items-end pt-3 border-t">
              <span className="font-bold text-base text-gray-900">Tổng thanh toán:</span>
              <span className="font-bold text-2xl text-red-600">{formatPrice(totalAmount)}</span>
            </div>
          </div>

          {/* C. NÚT ĐẶT HÀNG */}
          {isEditable ? (
            <Button type="submit" className="w-full h-12 text-base font-bold bg-red-600 hover:bg-red-700 shadow-sm mt-2">
              {watchPaymentMethod === "BANK" ? "Thanh toán ngay" : "Đặt hàng"}
            </Button>
          ) : (
            <Button type="button" variant="outline" className="w-full" onClick={onBack}>
              Tiếp tục mua sắm
            </Button>
          )}
        </CardContent>
      </Card>

      <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex gap-3 items-start">
        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
        <p className="text-xs text-gray-500 leading-relaxed">
          Cam kết sản phẩm chính hãng 100%. <br /> Đổi trả trong 7 ngày.
        </p>
      </div>
    </div>
  );
};