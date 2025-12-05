"use client";

import { useState, FC } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  MapPin,
  Plus,
  Map as MapIcon,
  Loader2,
} from "lucide-react";

// --- Types ---
interface Address {
  id: number;
  name: string;
  phone: string;
  address: string;
  type: string;
  isDefault: boolean;
}

// --- Dynamic Import Map Component ---
const MapPicker = dynamic(
  () => import("@/components/map-picker"), // Import file map-picker.tsx ở trên
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center bg-gray-100 min-h-[300px]">
        <Loader2 className="animate-spin text-primary" />
        <span className="ml-2 text-sm text-gray-500">Đang tải bản đồ...</span>
      </div>
    ),
  }
);

const demoAddresses: Address[] = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    phone: "0901234567",
    address:
      "123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh",
    type: "Nhà riêng",
    isDefault: true,
  },
];

export const AddressTab: FC = () => {
  const [isOpenAddressModal, setIsOpenAddressModal] = useState<boolean>(false);
  const [isMapOpen, setIsMapOpen] = useState<boolean>(false);

  const [addressInput, setAddressInput] = useState<string>("");
  const [provinceInput, setProvinceInput] = useState<string>("");

  const [tempSelectedAddress, setTempSelectedAddress] = useState<{
    address: string;
    lat: number;
    lng: number;
  } | null>(null);

  const MAP4D_KEY = process.env.NEXT_PUBLIC_MAP4D_KEY || "YOUR_MAP4D_KEY_HERE";

  const handleMapSelect = (data: { address: string; location: { lat: number; lng: number } }) => {
    setTempSelectedAddress({
      address: data.address,
      lat: data.location.lat,
      lng: data.location.lng,
    });
  };

  const handleConfirmLocation = () => {
    if (!tempSelectedAddress) {
      toast.error("Vui lòng chọn một vị trí trên bản đồ");
      return;
    }

    setAddressInput(tempSelectedAddress.address);

    // Logic tách chuỗi đơn giản để điền Tỉnh/Thành (Tùy chỉnh theo format chuỗi trả về của Map4D)
    // Ví dụ: "123 ABC, Phường X, Quận Y, Thành phố Z" -> Lấy 2 phần cuối
    const parts = tempSelectedAddress.address.split(",");
    if (parts.length >= 2) {
      const city = parts[parts.length - 1].trim();
      const district = parts[parts.length - 2].trim();
      setProvinceInput(`${district}, ${city}`);
    } else {
      setProvinceInput(tempSelectedAddress.address);
    }

    setIsMapOpen(false);
    toast.success("Đã cập nhật vị trí");
  };

  return (
    <>
      <Card className="border-none shadow-none bg-transparent lg:bg-white lg:border lg:shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 lg:mb-0 lg:p-6 lg:border-b border-gray-100">
          <div>
            <CardTitle className="text-xl">Sổ địa chỉ</CardTitle>
            <CardDescription>Quản lý danh sách địa chỉ nhận hàng</CardDescription>
          </div>
          <Button
            onClick={() => setIsOpenAddressModal(true)}
            className="w-full md:w-auto flex items-center gap-2"
          >
            <Plus size={18} /> Thêm địa chỉ mới
          </Button>
        </div>
        <CardContent className="px-0 lg:px-0">
          <div className="grid gap-4 lg:gap-0 lg:divide-y divide-gray-100">
            {demoAddresses.map((addr) => (
              <div
                key={addr.id}
                className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm lg:border-none lg:shadow-none lg:rounded-none lg:p-6 flex flex-col md:flex-row justify-between items-start gap-4 hover:bg-gray-50 transition-colors group"
              >
                <div className="space-y-2 w-full">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-900 text-base">
                      {addr.name}
                    </span>
                    {addr.isDefault && (
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100">
                        Mặc định
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-gray-500 font-normal">
                      {addr.type}
                    </Badge>
                  </div>
                  <p className="text-gray-500 text-sm">{addr.phone}</p>
                  <p className="text-gray-700 text-sm font-medium">{addr.address}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* --- MODAL NHẬP ĐỊA CHỈ (FORM CHÍNH) --- */}
      <Dialog open={isOpenAddressModal} onOpenChange={setIsOpenAddressModal}>
        <DialogContent className="w-screen h-screen max-w-none rounded-none md:h-auto md:w-full md:max-w-xl md:rounded-lg p-0 gap-0 flex flex-col">
          <DialogHeader className="p-4 md:p-6 border-b bg-white">
            <DialogTitle>Thêm địa chỉ mới</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50/50 md:bg-white">
            <div className="grid gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Họ và tên</Label>
                  <Input placeholder="Tên người nhận" />
                </div>
                <div className="grid gap-2">
                  <Label>Số điện thoại</Label>
                  <Input placeholder="Số điện thoại" type="tel" />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Địa chỉ</Label>
                <div className="flex flex-col md:flex-row gap-2">
                  <Input
                    placeholder="Tỉnh/Thành, Quận/Huyện..."
                    className="flex-1"
                    value={provinceInput}
                    onChange={(e) => setProvinceInput(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2 w-full md:w-auto text-primary border-primary/20 bg-primary/5 hover:bg-primary/10"
                    onClick={() => setIsMapOpen(true)}
                  >
                    <MapIcon size={16} /> Chọn trên bản đồ
                  </Button>
                </div>
                <Textarea
                  placeholder="Số nhà, tên đường cụ thể..."
                  className="min-h-[80px]"
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="default-addr"
                  className="accent-primary h-4 w-4"
                />
                <Label
                  htmlFor="default-addr"
                  className="font-normal cursor-pointer"
                >
                  Đặt làm địa chỉ mặc định
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter className="p-4 border-t bg-white flex-row gap-3 justify-end">
            <Button
              variant="outline"
              className="flex-1 md:flex-none"
              onClick={() => setIsOpenAddressModal(false)}
            >
              Hủy
            </Button>
            <Button className="flex-1 md:flex-none">Lưu địa chỉ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- MODAL MAP PICKER (Sử dụng Map4DAutoSuggest) --- */}
      <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
        <DialogContent className="w-screen h-screen max-w-none rounded-none md:max-w-3xl md:h-[85vh] md:rounded-lg p-0 flex flex-col overflow-hidden bg-gray-50">
          <div className="p-4 border-b bg-white flex items-center justify-between">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <MapPin className="text-primary" size={20} />
              Chọn vị trí giao hàng
            </h3>
          </div>

          <div className="flex-1 p-4 relative w-full h-full overflow-hidden">
            <MapPicker
              apiKey={MAP4D_KEY}
              className="h-full"
              onSelect={handleMapSelect}
            />
          </div>

          <div className="bg-white p-4 border-t shadow-lg z-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                  Vị trí đang chọn
                </p>
                <p className="text-sm font-bold text-gray-900 truncate mt-1">
                  {tempSelectedAddress ? tempSelectedAddress.address : "Chưa chọn vị trí"}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  Dữ liệu bản đồ bởi Map4D
                </p>
              </div>
              <Button
                className="w-full md:w-auto min-w-[150px]"
                onClick={handleConfirmLocation}
                disabled={!tempSelectedAddress}
              >
                Xác nhận vị trí
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddressTab;