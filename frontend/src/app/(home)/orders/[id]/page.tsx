"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  CheckCircle2, MapPin, Phone, User, CreditCard,
  ChevronLeft, Package, Truck, Clock, AlertCircle, Banknote, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import { orderServices } from "@/services/orderServices";
import { createPayment } from "@/services/PaymentService";
import { OrderWithDetails } from "@/types/order.type";
import { useCartStore } from '@/stores/useCartStore';

export default function OrderOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [order, setOrder] = useState<OrderWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);
  const clearCart = useCartStore((state) => state.clearCart);


  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await orderServices.getOrderDetailById(id);
        setOrder(res);
        await clearCart()
      } catch (error) {
        console.error("Lỗi tải đơn hàng:", error);
        toast.error("Không tìm thấy đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  const handleRepayment = async () => {
    if (!order) return;
    try {
      setIsPaying(true);
      const res = await createPayment(order._id);
      if (res && res.checkoutUrl) {
        window.location.href = res.checkoutUrl;
      } else {
        toast.error("Không thể tạo link thanh toán.");
      }
    } catch (error) {
      toast.error("Lỗi hệ thống thanh toán.");
    } finally {
      setIsPaying(false);
    }
  };

  // Helper format tiền
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Helper timeline trạng thái
  const getStepStatus = (step: string, currentStatus: string) => {
    const steps = ['pending', 'processing', 'delivery', 'completed'];
    const currentIndex = steps.indexOf(currentStatus);
    const stepIndex = steps.indexOf(step);

    if (currentStatus === 'canceled') return 'canceled';
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-gray-500">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col h-screen items-center justify-center gap-4">
        <h2 className="text-xl font-bold">Không tìm thấy đơn hàng</h2>
        <Button onClick={() => router.push('/')}>Về trang chủ</Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* HEADER: THÔNG BÁO THÀNH CÔNG */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100 text-center space-y-3">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Đặt hàng thành công!</h1>
          <p className="text-gray-600 max-w-lg mx-auto">
            Cảm ơn bạn đã mua sắm. Đơn hàng <span className="font-semibold text-gray-900">#{order._id.slice(-6).toUpperCase()}</span> của bạn đã được chuyển đến nhân viên xử lý.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Button variant="outline" onClick={() => router.push('/')}>Tiếp tục mua sắm</Button>
            <Button variant="secondary" onClick={() => router.push('/orders')}>Xem lịch sử đơn</Button>
          </div>
        </div>

        {/* TIMELINE TRẠNG THÁI */}
        {order.purchaseStatus !== 'canceled' && (
          <Card>
            <CardContent className="pt-8 pb-8">
              <div className="relative flex justify-between items-center px-2 md:px-10">
                {/* Line background */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-0 translate-y-[-50%]" />

                {/* Steps */}
                {[
                  { id: 'pending', label: 'Đặt hàng', icon: Clock },
                  { id: 'processing', label: 'Đang xử lý', icon: Package },
                  { id: 'delivery', label: 'Đang giao', icon: Truck },
                  { id: 'completed', label: 'Hoàn thành', icon: CheckCircle2 },
                ].map((step, index) => {
                  const status = getStepStatus(step.id, order.purchaseStatus);
                  let colorClass = "bg-gray-200 text-gray-400"; // Pending
                  if (status === 'completed' || status === 'current') colorClass = "bg-blue-600 text-white shadow-lg ring-4 ring-blue-50";

                  return (
                    <div key={step.id} className="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${colorClass}`}>
                        <step.icon size={18} />
                      </div>
                      <span className={`text-xs md:text-sm font-medium ${status === 'pending' ? 'text-gray-400' : 'text-gray-900'}`}>
                                    {step.label}
                                </span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* CỘT TRÁI: DANH SÁCH SẢN PHẨM */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Package className="w-5 h-5 text-gray-500" /> Sản phẩm ({order.details?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                {order.details?.map((item) => (
                  <div key={item._id} className="flex gap-4 py-2">
                    <div className="relative w-20 h-24 border rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                      {item.bookImage ? (
                        <Image src={item.bookImage} alt={item.bookName} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400"><Package size={24}/></div>
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="font-medium text-gray-900 line-clamp-2">{item.bookName}</h4>
                      <p className="text-sm text-gray-500">Số lượng: x{item.quantity}</p>
                      <p className="text-sm font-medium text-primary">{formatCurrency(item.price)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* CỘT PHẢI: THÔNG TIN THANH TOÁN & GIAO HÀNG */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thông tin đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Người nhận */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Địa chỉ nhận hàng</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{order.receiverName}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{order.receiverPhone}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <span className="leading-tight">{order.receiverAddress}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Thanh toán */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Thanh toán</h4>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Phương thức:</span>
                    <span className="font-bold">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Trạng thái:</span>
                    {order.paymentStatus === 'paid' ? (
                      <Badge className="bg-green-600">Đã thanh toán</Badge>
                    ) : (
                      <Badge variant="destructive">Chưa thanh toán</Badge>
                    )}
                  </div>

                  {/* Nếu chưa thanh toán và không phải COD -> Hiện nút thanh toán */}
                  {order.paymentStatus === 'unpaid' && order.paymentMethod === 'PAYOS' && order.purchaseStatus !== 'canceled' && (
                    <div className="pt-2">
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={handleRepayment}
                        disabled={isPaying}
                      >
                        {isPaying ? <Loader2 className="animate-spin mr-2" /> : <CreditCard className="mr-2 w-4 h-4" />}
                        Thanh toán ngay
                      </Button>
                      <p className="text-xs text-center text-gray-500 mt-2">
                        Thanh toán để hoàn tất đơn hàng
                      </p>
                    </div>
                  )}
                  {order.paymentStatus === 'unpaid' && order.paymentMethod === 'COD' && (
                    <div className="bg-orange-50 text-orange-700 p-3 rounded-md text-sm flex items-start gap-2">
                      <Banknote className="w-4 h-4 mt-0.5" />
                      <span>Vui lòng chuẩn bị {formatCurrency(order.totalAmount)} khi nhận hàng.</span>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Tổng tiền */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tạm tính:</span>
                    <span>{formatCurrency(order.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phí vận chuyển:</span>
                    <span>Miễn phí</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t mt-2">
                    <span>Tổng cộng:</span>
                    <span className="text-primary">{formatCurrency(order.totalAmount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center text-sm text-gray-400">
              Mã đơn: {order._id} <br />
              Ngày đặt: {new Date(order.purchaseDate).toLocaleDateString(
              "vi-VN"
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}