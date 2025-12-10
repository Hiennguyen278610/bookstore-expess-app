import { z } from "zod";

export const PAYMENT_METHODS = ["COD", "BANK"] as const;

export const checkoutSchema = z.object({
  paymentMethod: z.enum(PAYMENT_METHODS),

  shippingAddress: z
    .string()
    .min(5, "Vui lòng chọn địa chỉ nhận hàng"),

  customerName: z
    .string()
    .min(1, "Vui lòng nhập tên khách hàng"),

  customerPhone: z
    .string()
    .min(10, "Số điện thoại không hợp lệ"),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
