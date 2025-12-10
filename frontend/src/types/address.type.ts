import { z } from "zod";

const ADDRESS_TYPES = ["Nhà riêng", "Phòng trọ","Văn phòng", "Khác"] as const;

export const addressSchema = z.object({
  _id: z.string().optional(),

  name: z.string().trim().min(1, { message: "Vui lòng nhập tên" }),

  phone: z
    .string()
    .trim()
    .regex(/^0\d{9}$/, { message: "Số điện thoại không hợp lệ" }),

  addressType: z.enum(ADDRESS_TYPES),

  detail: z.string().trim().min(1, { message: "Vui lòng nhập địa chỉ chi tiết" }),

  province: z.string().min(1, { message: "Vui lòng chọn tỉnh/thành" }),

  district: z.string().min(1, { message: "Vui lòng chọn phường/xã" }),

  isDefault: z.boolean(),
});

export type Address = z.infer<typeof addressSchema>;
