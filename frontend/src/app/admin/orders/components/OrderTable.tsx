"use client";

import React, { useState } from "react";
import {
  Eye,
  MoreHorizontal,
  Package,
  CreditCard,
  CheckCircle,
  XCircle,
  Truck,
  Clock,
  HandCoins,
  QrCode,
  Check,
  X,
  Undo,
} from "lucide-react";
import { Order } from "@/types/order.type";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { mutate } from "swr";
import { orderServices } from "@/services/orderServices";
import { toast } from "sonner";

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

interface OrderTableProps {
  orders: Order[];
  onViewOrder: (order: Order) => void;
}

// Status Badge Components
const PurchaseStatusBadge = ({
  status,
}: {
  status: Order["purchaseStatus"];
}) => {
  const config: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    pending: {
      label: "Chờ xử lý",
      color: "bg-yellow-100 text-yellow-800",
      icon: <Clock className="w-3 h-3" />,
    },
    processing: {
      label: "Đang xử lý",
      color: "bg-blue-100 text-blue-800",
      icon: <Package className="w-3 h-3" />,
    },
    delivery: {
      label: "Đang giao hàng",
      color: "bg-purple-100 text-purple-800",
      icon: <Truck className="w-3 h-3" />,
    },
    completed: {
      label: "Hoàn thành",
      color: "bg-green-100 text-green-800",
      icon: <CheckCircle className="w-3 h-3" />,
    },
    canceled: {
      label: "Đã hủy",
      color: "bg-red-100 text-red-800",
      icon: <XCircle className="w-3 h-3" />,
    },
  };

  const { label, color, icon } = config[status] || { 
    label: status || "Chưa rõ", 
    color: "bg-gray-100 text-gray-700", 
    icon: null 
  };

  return (
    <Badge className={`${color} gap-1 font-medium`}>
      {icon}
      {label}
    </Badge>
  );
};

const PaymentStatusBadge = ({ status }: { status: Order["paymentStatus"] }) => {
  const config: Record<string, { label: string; color: string }> = {
    unpaid: { label: "Chưa thanh toán", color: "bg-gray-200 text-gray-800" },
    paid: { label: "Đã thanh toán", color: "bg-green-100 text-green-800" },
    failed: { label: "Thanh toán thất bại", color: "bg-red-100 text-red-800" },
    refunded: { label: "Đã hoàn tiền", color: "bg-orange-100 text-orange-800" },
  };

  const { label, color } = config[status] || { 
    label: status || "Chưa rõ", 
    color: "bg-gray-100 text-gray-700" 
  };

  return <Badge className={color}>{label}</Badge>;
};

const PaymentMethodBadge = ({ method }: { method: Order["paymentMethod"] }) => {
  const config: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    cash: {
      label: "Tiền mặt",
      color: "bg-blue-50 text-blue-700",
      icon: <HandCoins className="w-3 h-3" />,
    },
    creditCard: {
      label: "Thẻ tín dụng",
      color: "bg-purple-50 text-purple-700",
      icon: <CreditCard className="w-3 h-3" />,
    },
    payos: {
      label: "PayOS",
      color: "bg-indigo-50 text-indigo-700",
      icon: <QrCode className="h-3 w-3" />,
    },
  };

  const { label, color, icon } = config[method] || { 
    label: method || "Chưa rõ", 
    color: "bg-gray-50 text-gray-700", 
    icon: null 
  };

  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${color}`}
    >
      {icon && <span>{icon}</span>}
      {label}
    </div>
  );
};

// Định nghĩa Map cho các status options
const STATUS_OPTIONS_MAP = new Map<
  Order["purchaseStatus"],
  {
    label: string;
    icon: React.ReactNode;
    className?: string;
  }
>([
  [
    "pending",
    {
      label: "Chờ xử lý",
      icon: <Clock className="mr-2 h-4 w-4" />,
    },
  ],
  [
    "processing",
    {
      label: "Đang xử lý",
      icon: <Package className="mr-2 h-4 w-4" />,
    },
  ],
  [
    "delivery",
    {
      label: "Đang giao hàng",
      icon: <Truck className="mr-2 h-4 w-4" />,
    },
  ],
  [
    "completed",
    {
      label: "Hoàn thành",
      icon: <CheckCircle className="mr-2 h-4 w-4" />,
    },
  ],
  [
    "canceled",
    {
      label: "Hủy đơn",
      icon: <XCircle className="mr-2 h-4 w-4" />,
      className: "text-red-600",
    },
  ],
]);

const STATUS_WORKFLOW: Record<
  Order["purchaseStatus"],
  Order["purchaseStatus"][]
> = {
  pending: ["processing", "canceled"],
  processing: ["delivery", "canceled"],
  delivery: ["completed", "canceled"],
  completed: [], // Không thể chuyển từ completed
  canceled: [], // Không thể chuyển từ canceled
};

const PAYMENT_STATUS_MAP = new Map<
  Order["paymentStatus"],
  {
    label: string;
    icon: React.ReactNode;
    className?: string;
  }
>([
  [
    "unpaid",
    { label: "Chưa thanh toán", icon: <X className="mr-2 h-4 w-4" /> },
  ],
  [
    "paid",
    { label: "Đã thanh toán", icon: <Check className="mr-2 h-4 w-4" /> },
  ],
  ["refunded", { label: "Hoàn tiền", icon: <Undo className="mr-2 h-4 w-4" /> }],
]);

const PAYMENT_WORKFLOW: Record<
  Order["paymentStatus"],
  Order["paymentStatus"][]
> = {
  failed: [],
  unpaid: ["paid"],
  paid: ["refunded"],
  refunded: [],
};

export const OrderTable = ({ orders, onViewOrder }: OrderTableProps) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Handle actions
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    onViewOrder?.(order);
  };

  const handlePurchaseStatusChange = async (
    orderId: string,
    purchaseStatus: Order["purchaseStatus"]
  ) => {
    try {
      await orderServices.updateOrder(orderId, { purchaseStatus });
      toast.success(`Cập nhật trạng thái đơn hàng thành công`);
      mutate((key) => Array.isArray(key) && key[0] === "/get-orders");
    } catch (error) {
      console.error(error);
    }
  };

  const handlePaymentStatusChange = async (
    orderId: string,
    paymentStatus: Order["paymentStatus"]
  ) => {
    try {
      await orderServices.updateOrder(orderId, { paymentStatus });
      toast.success(`Cập nhật trạng thái thanh toán thành công`);
      mutate((key) => Array.isArray(key) && key[0] === "/get-orders");
    } catch (error) {
      console.error(error);
    }
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 my-4">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">
          Không có đơn hàng
        </h3>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-2xl p-4">
      <Table>
        <TableHeader>
          <TableRow className="bg-white">
            <TableHead className="font-semibold">Mã ĐH</TableHead>
            <TableHead className="font-semibold">Khách hàng</TableHead>
            <TableHead className="font-semibold text-center">Ngày đặt</TableHead>
            <TableHead className="font-semibold text-center">Tổng tiền</TableHead>
            <TableHead className="font-semibold">Trạng thái</TableHead>
            <TableHead className="font-semibold">Thanh toán</TableHead>
            <TableHead className="font-semibold">Phương thức</TableHead>
            <TableHead className="font-semibold text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow
              key={order._id}
              className="hover:bg-gray-50 transition-colors"
            >
              {/* Mã đơn hàng */}
              <TableCell className="font-medium">
                <div className="font-mono text-sm">
                  #{order._id.slice(-8).toUpperCase()}
                </div>
              </TableCell>

              {/* Thông tin khách hàng */}
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium">{order.customerId.fullName}</div>
                  <div className="text-sm text-gray-500">
                    {order.customerId.email}
                  </div>
                  {order.customerId.phone && (
                    <div className="text-sm text-gray-500">
                      {order.customerId.phone}
                    </div>
                  )}
                </div>
              </TableCell>

              {/* Ngày đặt */}
              <TableCell className="text-center">
                <div className="space-y-1">
                  <div>
                    {new Date(order.purchaseDate).toLocaleDateString("vi-VN")}
                  </div>
                  <div className="text-xs text-emerald-500">
                    {new Date(order.purchaseDate).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </TableCell>

              {/* Tổng tiền */}
              <TableCell className="font-semibold text-blue-600 text-center">
                {formatPrice(order.totalAmount)}
              </TableCell>

              {/* Trạng thái đơn hàng */}
              <TableCell>
                <PurchaseStatusBadge status={order.purchaseStatus} />
              </TableCell>

              {/* Trạng thái thanh toán */}
              <TableCell>
                <PaymentStatusBadge status={order.paymentStatus} />
              </TableCell>

              {/* Phương thức thanh toán */}
              <TableCell>
                <PaymentMethodBadge method={order.paymentMethod} />
              </TableCell>

              {/* Actions */}
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Mở menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Thao tác</DropdownMenuLabel>

                    <DropdownMenuItem onClick={() => handleViewOrder(order)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Xem chi tiết
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {order.purchaseStatus !== "canceled" &&
                      order.purchaseStatus !== "completed" && (
                        <>
                          <DropdownMenuLabel>
                            Chuyển trạng thái
                          </DropdownMenuLabel>
                          {STATUS_WORKFLOW[order.purchaseStatus]?.map(
                            (purchaseStatus) => {
                              const option =
                                STATUS_OPTIONS_MAP.get(purchaseStatus);
                              if (!option) return null;

                              return (
                                <DropdownMenuItem
                                  key={purchaseStatus}
                                  onClick={() =>
                                    handlePurchaseStatusChange(
                                      order._id,
                                      purchaseStatus
                                    )
                                  }
                                  className={option.className}
                                >
                                  {option.icon}
                                  {option.label}
                                </DropdownMenuItem>
                              );
                            }
                          )}
                          <DropdownMenuSeparator />
                        </>
                      )}

                    {order.paymentStatus !== "failed" && (
                      <>
                        <DropdownMenuLabel>
                          Cập nhật thanh toán
                        </DropdownMenuLabel>
                        {PAYMENT_WORKFLOW[order.paymentStatus]?.map(
                          (paymentStatus) => {
                            const option =
                              PAYMENT_STATUS_MAP.get(paymentStatus);
                            if (!option) return null;

                            return (
                              <DropdownMenuItem
                                key={paymentStatus}
                                onClick={() =>
                                  handlePaymentStatusChange(
                                    order._id,
                                    paymentStatus
                                  )
                                }
                              >
                                {option.icon}
                                {option.label}
                              </DropdownMenuItem>
                            );
                          }
                        )}
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
