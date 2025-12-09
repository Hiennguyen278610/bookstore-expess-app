'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import OrderItem from '@/components/order/OrderItem';
import { AddressSelectionDialog } from '@/components/order/AddressSelectionDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Banknote, CheckCircle, CreditCard, MapPin, Package, QrCode, Wallet } from 'lucide-react';
import { getAllAddress } from '@/services/addressservices';
import { DialogCancelPayment } from '@/components/payment/DialogCancelPayment';
import { formatPrice } from '@/lib/utils';
import { ItemCart, OrderPayload, OrderPayloadSchema } from '@/validation/orderSchema'; // Import đúng Schema mới
import { Address } from '@/types/address.type';
import { Badge } from '@/components/ui/badge';
import { CreateAddressModal } from '@/components/address/create-address-modal';
import { useCartStore } from '@/stores/useCartStore';
import { toast } from 'sonner'; // Cần import toast để thông báo

const OrderPage = () => {
  const router = useRouter();

  // Data Address
  const { addresses, isLoading: addressLoading, mutate } = getAllAddress();

  // Data Cart (Zustand)
  const cart = useCartStore((s) => s.cart);
  const fetchCart = useCartStore((s) => s.fetchCart);
  const cartLoading = useCartStore((s) => s.loading);

  const [openCancel, setOpenCancel] = useState(false);
  const [openAddressDialog, setOpenAddressDialog] = useState(false);
  const [openCreateAddress, setOpenCreateAddress] = useState(false);

  // 1. Fetch Cart khi mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Setup Form
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors, isSubmitting }
  } = useForm<OrderPayload>({
    resolver: zodResolver(OrderPayloadSchema),
    defaultValues: {
      items: [], // Ban đầu rỗng => cần sync bên dưới
      addressId: '',
      paymentMethod: 'COD'
    }
  });

  // --- LOGIC SYNC DỮ LIỆU ĐỂ PASS VALIDATION ---

  // 2. Sync Cart Items vào Form
  useEffect(() => {
    if (cart && cart.items.length > 0) {
      // Map từ CartItem (store) sang ItemCart (schema)
      const formItems: ItemCart[] = cart.items.map((item) => ({
        bookId: item.bookId,
        quantity: item.quantity,
        price: item.price
      }));

      // Set giá trị và kích hoạt validate ngay lập tức
      setValue('items', formItems, { shouldValidate: true });
    } else if (cart && cart.items.length === 0) {
      // Nếu cart rỗng sau khi fetch xong thì đẩy về trang chủ
      router.push('/');
    }
  }, [cart, setValue, router]);

  // 3. Sync Default Address vào Form
  useEffect(() => {
    // Chỉ set nếu đã load xong address và form chưa có giá trị addressId
    if (addresses && addresses.length > 0 && !getValues('addressId')) {
      const defaultAddr = addresses.find((addr: Address) => addr.isDefault) || addresses[0];
      if (defaultAddr) {
        setValue('addressId', defaultAddr._id!, { shouldValidate: true });
      }
    }
  }, [addresses, setValue, getValues]);

  // ---------------------------------------------

  const selectedAddressId = watch('addressId');

  // Logic hiển thị Address UI
  const selectedAddressInfo = addresses?.find(
    (addr: Address) => addr._id === selectedAddressId
  );

  const handleSelectAddress = (addr: Address) => {
    setValue('addressId', addr._id!, { shouldValidate: true });
    setOpenAddressDialog(false);
  };

  const handleSuccessCreateAddr = async (addr: Address) => {
    setOpenCreateAddress(false);
    await mutate(); // reload lại list address
    setValue('addressId', addr._id!, { shouldValidate: true });
  };

  const onSubmit = async (data: OrderPayload) => {
    // Lúc này data đã sạch và đúng chuẩn Schema
    console.log("Payload Validated:", data);

    try {
      // Gọi API createOrder(data) tại đây
      // await createOrder(data);
      toast.success("Đặt hàng thành công!");

      // Xóa cart sau khi đặt thành công (tùy logic backend)
      // useCartStore.getState().clearCart();
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi tạo đơn hàng");
    }
  };

  // Loading state
  if ((!cart && cartLoading) || addressLoading) {
    return <div className="flex justify-center items-center min-h-screen text-gray-500">Đang tải dữ liệu...</div>;
  }

  // Nếu fetch xong mà không có cart (hoặc null)
  if (!cart) {
    return null; // useEffect sẽ redirect ở trên
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" onClick={() => setOpenCancel(true)} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <DialogCancelPayment open={openCancel} onOpenChange={setOpenCancel} onConfirm={() => router.push('/')} />
          <h1 className="text-2xl font-bold text-gray-900">Thanh toán đơn hàng</h1>
        </div>

        {/* Thêm log lỗi vào đây để debug nếu cần */}
        <form onSubmit={handleSubmit(onSubmit, (err) => console.log("Form Errors:", err))} className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">

          <div className="lg:col-span-8 space-y-6">

            {/* 1. Address Section */}
            <Card className={`border-none shadow-sm ring-1 ${errors.addressId ? 'ring-red-500' : 'ring-gray-200'}`}>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-600" /> Địa chỉ nhận hàng
                </CardTitle>
                <Button type="button" variant="ghost" size="sm" onClick={() => setOpenAddressDialog(true)} className="text-blue-600 h-8 font-medium">
                  {selectedAddressId ? 'Thay đổi' : 'Chọn địa chỉ'}
                </Button>
              </CardHeader>
              <CardContent>
                {selectedAddressInfo ? (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                      <span>{selectedAddressInfo.name}</span>
                      <span className="w-[1px] h-4 bg-gray-300"></span>
                      <span>{selectedAddressInfo.phone}</span>
                      {selectedAddressInfo.isDefault && <Badge variant="secondary" className="bg-blue-50 text-blue-700">Mặc định</Badge>}
                    </div>
                    <p className="text-gray-700 text-sm">{selectedAddressInfo.detail}, {selectedAddressInfo.district}, {selectedAddressInfo.province}</p>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 italic p-2 border border-dashed rounded text-center">
                    Vui lòng chọn địa chỉ để giao hàng
                  </div>
                )}
                {errors.addressId && <p className="text-red-500 text-sm mt-2 font-medium">⚠️ {errors.addressId.message}</p>}
              </CardContent>
            </Card>

            {/* 2. Order Details Section */}
            <Card className="border-none shadow-sm ring-1 ring-gray-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="w-5 h-5 text-gray-500" /> Chi tiết đơn hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 divide-y">
                {/* Check lỗi Items */}
                {errors.items && <p className="text-red-500 text-sm font-medium px-2">⚠️ {errors.items.message}</p>}

                {cart.items.map((item) => (
                  <div key={item._id} className="pt-4 first:pt-0">
                    {/* Render Item UI */}
                    <OrderItem bookId={item.bookId} quantity={item.quantity} price={item.price} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Payment & Total */}
          <div className="lg:col-span-4">
            <div className="sticky top-6 space-y-4">

              {/* Payment Method */}
              <Card className="border-none shadow-sm ring-1 ring-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-blue-600" /> Phương thức thanh toán
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Controller
                    name="paymentMethod"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid gap-3">
                        <PaymentOption value="COD" label="Thanh toán khi nhận hàng (COD)" icon={<Banknote className="text-orange-600 w-5 h-5" />} selected={field.value} />
                        <PaymentOption value="PAYOS" label="Quét mã QR (PayOS)" icon={<QrCode className="text-green-600 w-5 h-5" />} selected={field.value} />
                        <PaymentOption value="CARD" label="Thẻ tín dụng / Ghi nợ" icon={<CreditCard className="text-indigo-600 w-5 h-5" />} selected={field.value} />
                      </RadioGroup>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Total & Submit */}
              <Card className="border-none shadow-md ring-1 ring-gray-200 overflow-hidden">
                <div className="bg-gray-900 text-white p-4">
                  <h3 className="font-bold flex items-center gap-2"><Wallet className="w-5 h-5" /> Tổng cộng</h3>
                </div>
                <CardContent className="p-4 space-y-6">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600"><span>Tạm tính:</span><span>{formatPrice(cart.totalPrice)}</span></div>
                    <div className="flex justify-between text-gray-600"><span>Vận chuyển:</span><span className="text-green-600 font-medium">Miễn phí</span></div>
                    <Separator className="my-2" />
                    <div className="flex justify-between items-end pt-1">
                      <span className="font-bold text-base text-gray-900">Tổng thanh toán:</span>
                      <span className="font-bold text-2xl text-red-600">{formatPrice(cart.totalPrice)}</span>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-bold bg-red-600 hover:bg-red-700 shadow-sm mt-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Đang xử lý...' : 'Thanh toán ngay'}
                  </Button>
                </CardContent>
              </Card>

              <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex gap-3 items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <p className="text-xs text-gray-500 leading-relaxed">Cam kết bảo mật thanh toán. <br /> Hoàn tiền nếu có lỗi giao dịch.</p>
              </div>

            </div>
          </div>
        </form>

        <AddressSelectionDialog open={openAddressDialog} onOpenChange={setOpenAddressDialog} onSelect={handleSelectAddress} onAddNew={() => setOpenCreateAddress(true)} />
        {openCreateAddress && <CreateAddressModal isOpen={openCreateAddress} onClose={() => setOpenCreateAddress(false)} initialData={null} onSuccess={handleSuccessCreateAddr} />}
      </div>
    </div>
  );
};

// Component phụ để code gọn hơn
const PaymentOption = ({ value, label, icon, selected }: { value: string, label: string, icon: React.ReactNode, selected: string }) => (
  <div className={`relative flex items-center justify-between space-x-2 border p-3 rounded-lg cursor-pointer transition-all ${selected === value ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' : 'border-gray-200 hover:border-gray-300'}`}>
    <div className="flex items-center space-x-3 w-full">
      <RadioGroupItem value={value} id={value} />
      <label htmlFor={value} className="cursor-pointer flex-1 flex items-center gap-2">
        {icon} <span className="font-medium text-gray-900 text-sm">{label}</span>
      </label>
    </div>
  </div>
);

export default OrderPage;