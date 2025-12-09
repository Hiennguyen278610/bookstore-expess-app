'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form'; // Thêm Controller
import { zodResolver } from '@hookform/resolvers/zod';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import OrderItem from '@/components/order/OrderItem';
import { AddressSelectionDialog } from '@/components/order/AddressSelectionDialog';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CheckCircle, MapPin, Package, Wallet, CreditCard, Banknote, QrCode } from 'lucide-react';
import { getAllAddress } from '@/services/addressservices';
import { DialogCancelPayment } from '@/components/payment/DialogCancelPayment';
import { formatPrice } from '@/lib/utils';
import { ItemCart, OrderPayload, OrderPayloadSchema } from '@/validation/orderSchema';
import { Address } from '@/types/address.type';
import { Badge } from '@/components/ui/badge';
import { CreateAddressModal } from '@/components/address/create-address-modal';


const initialCheckoutData = {
  items: [],
  totalPrice: 0
};

const OrderPage = () => {
  const router = useRouter();
  const { addresses, isLoading, mutate } = getAllAddress();
  const [openCancel, setOpenCancel] = useState(false);
  const [openAddressDialog, setOpenAddressDialog] = useState(false);
  const [openCreateAddress, setOpenCreateAddress] = useState(false);
  const [checkoutData, setCheckoutData] = useState<any>(initialCheckoutData);

  useEffect(() => {
    const storedData = sessionStorage.getItem('checkoutData');
    if (storedData) {
      setCheckoutData(JSON.parse(storedData));
    }
  }, []);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<OrderPayload>({
    resolver: zodResolver(OrderPayloadSchema),
    defaultValues: {
      items: [],
      addressId: '',
      paymentMethod: 'COD'
    }
  });

  const selectedAddressId = watch('addressId');
  const selectedAddressInfo = addresses?.find(
    (addr: Address) => addr._id === selectedAddressId
  ) || addresses?.find((addr: Address) => addr.isDefault);

  const handleSelectAddress = (addr: Address) => {
    setValue('addressId', addr?._id!, { shouldValidate: true });
    setOpenAddressDialog(false);
  };
  const handleSuccess = async (addr: Address) => {
    console.log("Address: " , addr);
    setOpenCreateAddress(false);
    await mutate();
    setValue('addressId', addr?._id!, { shouldValidate: true })
  };


  const onSubmit = async (data: OrderPayload) => {
    const payload = {
      ...data,
      items: checkoutData.items.map((item: ItemCart) => ({
        bookId: item.bookId,
        quantity: item.quantity,
        price: item.price
      }))
    };

    console.log("Dữ liệu gửi đi:", payload);
    // Gọi API tạo đơn hàng ở đây...
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpenCancel(true)}
            className="rounded-full cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <DialogCancelPayment
            open={openCancel}
            onOpenChange={setOpenCancel}
            onConfirm={() => {
              setOpenCancel(false);
              router.push('/');
            }}
          />
          <h1 className="text-2xl font-bold text-gray-900">Thanh toán đơn hàng</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">

          <div className="lg:col-span-8 space-y-6">

            <Card className={`border-none shadow-sm ring-1 ${errors.addressId ? 'ring-red-500' : 'ring-gray-200'}`}>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-600" /> Địa chỉ nhận hàng
                </CardTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setOpenAddressDialog(true)}
                  className="text-blue-600 h-8 font-medium"
                >
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
                      { selectedAddressInfo.isDefault && (
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100">
                          Mặc định
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-700 text-sm">{selectedAddressInfo.detail + ", " + selectedAddressInfo.district + ", " + selectedAddressInfo.province}</p>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 italic">
                    Vui lòng chọn địa chỉ nhận hàng
                  </div>
                )}
                {errors.addressId && (
                  <p className="text-red-500 text-sm mt-2 font-medium">⚠️ {errors.addressId.message}</p>
                )}
              </CardContent>
            </Card>

            {/* 2. Chi tiết đơn hàng */}
            <Card className="border-none shadow-sm ring-1 ring-gray-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="w-5 h-5 text-gray-500" /> Chi tiết đơn hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 divide-y">
                {checkoutData.items?.map((item: any) => (
                  <div key={item.bookId} className="pt-4 first:pt-0">
                    <OrderItem bookId={item.bookId} quantity={item.quantity} price={item.price} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* === CỘT PHẢI: 4 Phần (Thanh toán & Phương thức) === */}
          <div className="lg:col-span-4">
            <div className="sticky top-6 space-y-4">

              {/* 3. Phương thức thanh toán (ĐÃ CHUYỂN SANG ĐÂY) */}
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
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid gap-3"
                      >
                        {/* Option 1: PayOS */}
                        <div className={`relative flex items-center justify-between space-x-2 border p-3 rounded-lg cursor-pointer transition-all ${field.value === 'PAYOS' ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'border-gray-200 hover:border-gray-300'}`}>
                          <div className="flex items-center space-x-3 w-full">
                            <RadioGroupItem value="PAYOS" id="payos" />
                            <label htmlFor="payos" className="cursor-pointer flex-1 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-indigo-600"/>
                                <span className="font-medium text-gray-900 text-sm">Cổng thanh toán PayOS</span>
                              </div>
                              {/* Logo PayOS nếu có thì để img ở đây, không thì để text hoặc icon */}
                            </label>
                          </div>
                        </div>

                        {/* Option 2: Quét mã QR */}
                        <div className={`relative flex items-center justify-between space-x-2 border p-3 rounded-lg cursor-pointer transition-all ${field.value === 'QR' ? 'border-green-600 bg-green-50 ring-1 ring-green-600' : 'border-gray-200 hover:border-gray-300'}`}>
                          <div className="flex items-center space-x-3 w-full">
                            <RadioGroupItem value="QR" id="qr" />
                            <label htmlFor="qr" className="cursor-pointer flex-1 flex items-center gap-2">
                              <QrCode className="w-5 h-5 text-green-600"/>
                              <span className="font-medium text-gray-900 text-sm">Chuyển khoản QR Code</span>
                            </label>
                          </div>
                        </div>
                      </RadioGroup>
                    )}
                  />
                </CardContent>
              </Card>

              {/* 4. Tổng tiền & Nút thanh toán */}
              <Card className="border-none shadow-md ring-1 ring-gray-200 overflow-hidden">
                <div className="bg-gray-900 text-white p-4">
                  <h3 className="font-bold flex items-center gap-2">
                    <Wallet className="w-5 h-5" /> Tổng cộng
                  </h3>
                </div>

                <CardContent className="p-4 space-y-6">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Tạm tính:</span>
                      <span>{formatPrice(checkoutData.totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Vận chuyển:</span>
                      <span className="text-green-600 font-medium">Miễn phí</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between items-end pt-1">
                      <span className="font-bold text-base text-gray-900">Tổng thanh toán:</span>
                      <span className="font-bold text-2xl text-red-600">{formatPrice(checkoutData.totalPrice)}</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-bold bg-red-600 hover:bg-red-700 shadow-sm mt-2 transition-all"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Đang xử lý...' : 'Thanh toán ngay'}
                  </Button>
                </CardContent>
              </Card>

              <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex gap-3 items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <p className="text-xs text-gray-500 leading-relaxed">
                  Cam kết bảo mật thanh toán. <br /> Hoàn tiền nếu có lỗi giao dịch.
                </p>
              </div>
            </div>
          </div>
        </form>

        <AddressSelectionDialog
          open={openAddressDialog}
          onOpenChange={setOpenAddressDialog}
          onSelect={handleSelectAddress}
          onAddNew={() => {
            setOpenCreateAddress(true)
          }}
        />
        {openCreateAddress && (
          <CreateAddressModal
            isOpen={openCreateAddress}
            onClose={() => setOpenCreateAddress(false)}
            initialData={null}
            onSuccess={handleSuccess}
          />
        )}
      </div>
    </div>
  );
};


export default OrderPage;