// components/orders/OrderDetailDialog.tsx
"use client";

import React from "react";
import useSWR from "swr";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  User,
  CreditCard,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Mail,
  Hash,
  ShoppingBag,
  Loader2,
  Phone,
  MapPin,
  Tag,
} from "lucide-react";
import { OrderWithDetails } from "@/types/order.type";
import { orderServices } from "@/services/orderServices";
import { cn } from "@/lib/utils";

interface OrderDetailDialogProps {
  orderId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OrderDetailDialog = ({
  orderId,
  open,
  onOpenChange,
}: OrderDetailDialogProps) => {
  const { data: order, isLoading } = useSWR<OrderWithDetails>(
    open && orderId ? [`/orders/${orderId}`] : null,
    () => orderServices.getOrderDetailById(orderId),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Map purchase status to Vietnamese text and badge variant
  const getPurchaseStatusInfo = (
    status: OrderWithDetails["purchaseStatus"]
  ) => {
    switch (status) {
      case "pending":
        return {
          text: "Chờ xử lý",
          variant: "outline" as const,
          color: "bg-amber-50 border-amber-200 text-amber-800",
          icon: <Clock className="h-4 w-4 mr-2" />,
        };
      case "processing":
        return {
          text: "Đang xử lý",
          variant: "outline" as const,
          color: "bg-blue-50 border-blue-200 text-blue-800",
          icon: <Package className="h-4 w-4 mr-2" />,
        };
      case "delivery":
        return {
          text: "Đang giao hàng",
          variant: "outline" as const,
          color: "bg-purple-50 border-purple-200 text-purple-800",
          icon: <Truck className="h-4 w-4 mr-2" />,
        };
      case "completed":
        return {
          text: "Hoàn thành",
          variant: "default" as const,
          color: "bg-emerald-50 border-emerald-200 text-emerald-800",
          icon: <CheckCircle className="h-4 w-4 mr-2" />,
        };
      case "canceled":
        return {
          text: "Đã hủy",
          variant: "destructive" as const,
          color: "bg-red-50 border-red-200 text-red-800",
          icon: <XCircle className="h-4 w-4 mr-2" />,
        };
      default:
        return {
          text: status,
          variant: "outline" as const,
          color: "bg-gray-50 border-gray-200 text-gray-800",
          icon: null,
        };
    }
  };

  // Map payment method to Vietnamese text
  const getPaymentMethodText = (method: OrderWithDetails["paymentMethod"]) => {
    switch (method) {
      case "cash":
        return "Tiền mặt";
      case "creditCard":
        return "Thẻ tín dụng";
      case "payos":
        return "PayOS";
      default:
        return method;
    }
  };

  // Map payment status to Vietnamese text and badge variant
  const getPaymentStatusInfo = (status: OrderWithDetails["paymentStatus"]) => {
    switch (status) {
      case "paid":
        return {
          text: "Đã thanh toán",
          variant: "default" as const,
          color: "bg-emerald-50 border-emerald-200 text-emerald-800",
        };
      case "unpaid":
        return {
          text: "Chưa thanh toán",
          variant: "destructive" as const,
          color: "bg-red-50 border-red-200 text-red-800",
        };
      case "failed":
        return {
          text: "Thanh toán thất bại",
          variant: "destructive" as const,
          color: "bg-amber-50 border-amber-200 text-amber-800",
        };
      case "refunded":
        return {
          text: "Đã hoàn tiền",
          variant: "outline" as const,
          color: "bg-blue-50 border-blue-200 text-blue-800",
        };
      default:
        return {
          text: status,
          variant: "outline" as const,
          color: "bg-gray-50 border-gray-200 text-gray-800",
          icon: null,
        };
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[95vh] p-0 overflow-hidden bg-white shadow-2xl rounded-lg">
        <DialogHeader className="px-8 pt-8 pb-6 border-b bg-gradient-to-r from-gray-50 to-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <ShoppingBag className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-gray-900">
                    Đơn hàng #{orderId.slice(-8).toUpperCase()}
                  </DialogTitle>
                  <DialogDescription className="text-gray-600 mt-1">
                    {order
                      ? formatDate(order.purchaseDate)
                      : "Đang tải thông tin đơn hàng..."}
                  </DialogDescription>
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[calc(95vh-220px)]">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center py-20 space-y-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-gray-600">Đang tải thông tin đơn hàng...</p>
            </div>
          ) : order ? (
            <div className="space-y-6 p-6">
              {/* Customer and Order Info - Line Layout */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-5 bg-teal-500 rounded-full"></div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Thông tin đơn hàng
                  </h3>
                </div>

                {/* Line Layout */}
                <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                  {/* Line 1: Customer Name and Email */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 mb-0.5">
                          Khách hàng
                        </p>
                        <p className="font-semibold text-gray-900 truncate">
                          {order.customerName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 mb-0.5">
                          Mã KH
                        </p>
                        <p className="text-gray-900 truncate">
                          #{order.customerId.slice(-8).toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Line 2: Order Date and Time */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 mb-0.5">
                          Ngày đặt hàng
                        </p>
                        <p className="font-semibold text-gray-900">
                          {new Date(order.purchaseDate).toLocaleDateString(
                            "vi-VN"
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 mb-0.5">
                          Trạng thái đơn hàng
                        </p>
                        <Badge
                          className={cn(
                            "px-2.5 py-1 text-xs border w-fit",
                            getPurchaseStatusInfo(order.purchaseStatus).color
                          )}
                          variant={
                            getPurchaseStatusInfo(order.purchaseStatus).variant
                          }
                        >
                          <div className="flex items-center">
                            {getPurchaseStatusInfo(order.purchaseStatus).icon}
                            <span className="truncate">
                              {getPurchaseStatusInfo(order.purchaseStatus).text}
                            </span>
                          </div>
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Line 4: Payment Method and Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 mb-0.5">
                          Phương thức thanh toán
                        </p>
                        <p className="text-gray-900">
                          {getPaymentMethodText(order.paymentMethod)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 mb-0.5">
                          Trạng thái thanh toán
                        </p>
                        <Badge
                          className={cn(
                            "px-2.5 py-1 text-xs border w-fit",
                            getPaymentStatusInfo(order.paymentStatus).color
                          )}
                          variant={
                            getPaymentStatusInfo(order.paymentStatus).variant
                          }
                        >
                          <div className="flex items-center">
                            {getPaymentStatusInfo(order.paymentStatus).icon}
                            <span className="truncate">
                              {getPaymentStatusInfo(order.paymentStatus).text}
                            </span>
                          </div>
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Books List - Compact */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-5 bg-teal-500 rounded-full"></div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Chi tiết đơn hàng
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5">
                      Danh sách sách đã đặt trong đơn hàng
                    </p>
                  </div>
                  <Badge variant="outline" className="px-3 py-1 text-sm">
                    {order.details.reduce(
                      (sum, item) => sum + item.quantity,
                      0
                    )}{" "}
                    sản phẩm
                  </Badge>
                </div>

                <div className="flex justify-between">
                  <p className="text-lg font-medium text-gray-500">
                    Tổng tiền :{" "}
                  </p>
                  <p className="text-lg font-bold text-emerald-600">
                    {formatCurrency(order.totalAmount)}
                  </p>
                </div>

                <div className="space-y-2">
                  {order.details.map((detail, index) => (
                    <div
                      key={detail._id}
                      className="flex items-center p-3 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {/* Item Number */}
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="font-semibold text-primary text-xs">
                          {index + 1}
                        </span>
                      </div>

                      {/* Book Image */}
                      <div className="relative w-14 h-18 flex-shrink-0">
                        {detail.bookImage ? (
                          <Image
                            src={detail.bookImage}
                            alt={detail.bookName}
                            fill
                            className="object-cover rounded"
                            sizes="56px"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                            <Package className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Book Info */}
                      <div className="flex-1 ml-3 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                          <div className="space-y-1">
                            <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
                              {detail.bookName}
                            </h4>
                            <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                              <div className="flex items-center gap-1">
                                <span>Số lượng:</span>
                                <span className="font-semibold">
                                  {detail.quantity}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Price Info */}
                          <div className="flex flex-col items-end">
                            <p className="font-bold text-gray-900 text-sm">
                              {formatCurrency(detail.total)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatCurrency(detail.price)} × {detail.quantity}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div className="p-3 bg-red-50 rounded-full mb-3">
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1.5">
                Không tìm thấy đơn hàng
              </h3>
              <p className="text-gray-600 text-center text-sm">
                Không thể tải thông tin đơn hàng #{orderId}
              </p>
            </div>
          )}
        </ScrollArea>

        <div className="px-6 py-4 border-t bg-gray-50">
          <div className="flex justify-end gap-2">
            <Button
              size="default"
              onClick={() => onOpenChange(false)}
              className="min-w-[80px] bg-emerald-500 hover:bg-emerald-800"
            >
              Đóng
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailDialog;
