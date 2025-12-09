"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Briefcase,
  Building2,
  Home,
  Loader2,
  Map as MapIcon,
  MapPin,
} from "lucide-react";
import { AddressComponent, MapPickerModal } from "./map-picker-modal";
import { Controller, useForm, SubmitErrorHandler } from "react-hook-form"; // Import SubmitErrorHandler
import { zodResolver } from "@hookform/resolvers/zod";
import { Address, addressSchema } from "@/types/address.type";
import { cn, normalizeString } from "@/lib/utils";
import {
  createAddress,
  updateAddress,
  getDistricts,
  getProvinces,
  Province,
} from "@/services/addressservices";
import { toast } from "sonner";

interface CreateAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Address | null; // <--- Dữ liệu cần sửa (nếu có)
  onSuccess?: (addr: Address) => void; // <--- Hàm gọi lại khi thành công để reload list
}

const ADDRESS_TYPES = [
  { id: "Nhà riêng", label: "Nhà riêng", icon: Home },
  { id: "Phòng trọ", label: "Phòng trọ", icon: Building2 },
  { id: "Văn phòng", label: "Văn phòng", icon: Briefcase },
  { id: "Khác", label: "Khác", icon: MapPin },
];

export const CreateAddressModal = ({
  isOpen,
  onClose,
  initialData,
  onSuccess,
}: CreateAddressModalProps) => {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [districts, setDistricts] = useState<Province[]>([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<Address>({
    defaultValues: {
      _id: initialData?._id,
      name: "",
      phone: "",
      province: "",
      district: "",
      detail: "",
      addressType: "Nhà riêng",
      isDefault: false,
    },
    resolver: zodResolver(addressSchema),
    mode: "onChange",
  });

  const { provinces, isLoading: isLoadingProvinces } = getProvinces();

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // TRƯỜNG HỢP SỬA:
        const provinceObj = provinces?.find(
          (p) => p.name === initialData.province
        );
        const provinceId = provinceObj?.id || "";

        if (provinceId) {
          getDistricts(provinceId).then((res) => setDistricts(res));
        }
        setValue("name", initialData.name);
        setValue("phone", initialData.phone);
        setValue("province", provinceId);
        setValue("district", initialData.district);
        setValue("detail", initialData.detail);
        setValue("addressType", initialData.addressType);
        setValue("isDefault", initialData.isDefault);
      } else {
        setValue("name", "");
        setValue("phone", "");
        setValue("province", "");
        setValue("district", "");
        setValue("detail", "");
        setValue("addressType", "Nhà riêng");
        setValue("isDefault", false);
        setDistricts([]);
      }
    }
  }, [isOpen, initialData, provinces, setValue]);

  const handleMapConfirm = (address: AddressComponent[]) => {
    // const province = address.find((a) => a.types[0] == "admin_level_2");
    // setValue("province", province?.name);
  };

  const onSubmit = async (data: Address) => {
    const provinceName =
      provinces?.find((item) => item.id == data.province)?.name ||
      data.province;

    const payload = {
      ...data,
      province: provinceName,
    };

    let res;
    if (initialData?._id) {
      res = await updateAddress(payload);
      if (res) toast.success("Cập nhật địa chỉ thành công");
      else toast.error("Cập nhật thất bại");
    } else {
      res = await createAddress(payload);
      if (res) toast.success("Thêm địa chỉ thành công");
      else toast.error("Thêm thất bại");
    }

    // Gọi callback onSuccess để component cha reload lại list
    if (res && onSuccess) {
      onSuccess(data);
    }

    onClose();
  };
  const onError: SubmitErrorHandler<Address> = (errors) => {
    console.log("SUBMIT ERROR (Validation):", errors);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className="sm:max-w-lg p-0 gap-0 sm:rounded-xl overflow-hidden max-h-[90vh] flex flex-col"
          aria-describedby="form-desc"
        >
          <DialogHeader className="p-5 border-b bg-gray-50/50">
            <DialogTitle>
              {initialData ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
            </DialogTitle>
            <DialogDescription id="form-desc" className="sr-only">
              Form nhập thông tin
            </DialogDescription>
          </DialogHeader>

          <form>
            <div className="p-5 space-y-5 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className={cn(errors.name && "text-red-500")}>
                    Họ tên
                  </Label>
                  <Input
                    {...register("name")}
                    className={cn(
                      errors.name && "border-red-500 focus-visible:ring-red-500"
                    )}
                    placeholder="Nguyễn Văn A"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs font-medium animate-in fade-in-50 slide-in-from-top-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className={cn(errors.phone && "text-red-500")}>
                    Số điện thoại
                  </Label>
                  <Input
                    {...register("phone")}
                    className={cn(
                      errors.phone &&
                        "border-red-500 focus-visible:ring-red-500"
                    )}
                    placeholder="0123123123"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs font-medium animate-in fade-in-50 slide-in-from-top-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="border-t border-dashed"></div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-base font-semibold">
                    Địa chỉ nhận hàng
                  </Label>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-primary hover:text-primary hover:bg-primary/5 h-8 gap-2 border-primary/20"
                    type="button"
                    onClick={() => setIsMapOpen(true)}
                  >
                    <MapIcon size={14} />{" "}
                    {isLoadingProvinces
                      ? "Đang tải tỉnh..."
                      : "Chọn trên bản đồ"}
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Controller
                      control={control}
                      name="province"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={async (value) => {
                            field.onChange(value);
                            setValue("district", "");
                            const res = await getDistricts(value);
                            setDistricts(res);
                          }}
                        >
                          <SelectTrigger
                            className={cn(errors.province && "border-red-500")}
                          >
                            <SelectValue placeholder="Tỉnh / Thành" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[240px]">
                            {provinces?.map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.province && (
                      <p className="text-red-500 text-xs">
                        {errors.province.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Controller
                      control={control}
                      name="district"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={districts.length === 0}
                        >
                          <SelectTrigger
                            className={cn(errors.district && "border-red-500")}
                          >
                            <SelectValue placeholder="Phường / Xã" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[240px]">
                            {districts?.map((item) => (
                              <SelectItem key={item.id} value={item.name}>
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.district && (
                      <p className="text-red-500 text-xs">
                        {errors.district.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Địa chỉ chi tiết</Label>
                  <Textarea
                    {...register("detail")}
                    placeholder="Số nhà, tên đường, phường/xã..."
                    className={cn(
                      "min-h-[80px] resize-none",
                      errors.detail && "border-red-500"
                    )}
                  />
                  {errors.detail && (
                    <p className="text-red-500 text-xs">
                      {errors.detail.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Loại địa chỉ</Label>
                <Controller
                  control={control}
                  name="addressType"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn loại địa chỉ" />
                      </SelectTrigger>
                      <SelectContent>
                        {ADDRESS_TYPES.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            <div className="flex items-center gap-2">
                              <type.icon
                                size={16}
                                className="text-muted-foreground"
                              />
                              <span>{type.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="default-chk"
                  {...register("isDefault")}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary"
                />
                <Label
                  htmlFor="default-chk"
                  className="font-normal cursor-pointer select-none"
                >
                  Đặt làm địa chỉ mặc định
                </Label>
              </div>
            </div>

            <DialogFooter className="p-4 border-t bg-gray-50/50 sm:justify-end gap-2">
              <Button variant="outline" type="button" onClick={onClose}>Hủy bỏ</Button>
              <Button
                type="button"
                onClick={handleSubmit(onSubmit, onError)}
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Lưu địa chỉ'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <MapPickerModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onConfirm={handleMapConfirm}
      />
    </>
  );
};
