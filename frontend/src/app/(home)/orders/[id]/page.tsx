"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { getOrderById } from "@/services/orderservices";
import OrderItem from "@/components/order/OrderItem";

// --- Components Mới ---
import { AddressCard } from "@/components/checkout/AddressCard";
import { PaymentSummaryCard } from "@/components/checkout/PaymentSummaryCard";
import { MOCK_ADDRESSES } from "@/components/checkout/AddressSelectionDialog";

// --- UI Libs ---
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Package, Loader2 } from "lucide-react";

// --- SCHEMA ---
import { CheckoutFormValues, checkoutSchema } from '@/validation/checkOutSchemas';


const OrderDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;
  const { order, isLoading, error } = getOrderById(orderId);

  // --- FORM SETUP ---
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "COD",
      shippingAddress: "",
      customerName: "",
      customerPhone: "",
    },
  });

  // --- SYNC DATA ---
  useEffect(() => {
    if (order) {
      const defaultAddr = order.shippingAddress || MOCK_ADDRESSES[0].address;
      const defaultName = order.user?.fullName || MOCK_ADDRESSES[0].name;
      const defaultPhone = order.user?.phone || MOCK_ADDRESSES[0].phone;

      form.reset({
        paymentMethod: (order.paymentMethod === "bank" || order.paymentMethod === "payos") ? "BANK" : "COD",
        shippingAddress: defaultAddr,
        customerName: defaultName,
        customerPhone: defaultPhone,
      });
    }
  }, [order, form]);

  // --- SUBMIT ---
  const onSubmit = (data: CheckoutFormValues) => {
    console.log("Submit Data:", data);
    if (data.paymentMethod === "BANK") {
      alert("Chuyển hướng thanh toán QR Code...");
    } else {
      alert("Đặt hàng thành công (COD)!");
    }
  };

  if (isLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-green-600" /></div>;
  if (error || !order) return <div className="text-center mt-20">Không tìm thấy đơn hàng</div>;

  const isEditable = order.purchaseStatus === 'pending';

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Thanh toán đơn hàng</h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">

            {/* === CỘT TRÁI: 8 Phần === */}
            <div className="lg:col-span-8 space-y-6">

              {/* 1. Component Địa chỉ */}
              <AddressCard
                control={form.control}
                isEditable={isEditable}
                setValue={form.setValue}
                watch={form.watch}
              />

              {/* 2. Component Danh sách sản phẩm (Có thể tách nốt nếu muốn) */}
              <Card className="border-none shadow-sm ring-1 ring-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="w-5 h-5 text-gray-500" /> Chi tiết đơn hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 divide-y">
                  {order.details?.map((item: any) => (
                    <div key={item._id} className="pt-4 first:pt-0">
                      <OrderItem bookId={item.bookId} quantity={item.quantity} price={item.price} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* === CỘT PHẢI: 4 Phần === */}
            <div className="lg:col-span-4">
              <PaymentSummaryCard
                control={form.control}
                totalAmount={order.totalAmount}
                isEditable={isEditable}
                onBack={() => router.push('/')}
                watchPaymentMethod={form.watch("paymentMethod")}
              />
            </div>

          </form>
        </Form>
      </div>
    </div>
  );
};

export default OrderDetailPage;