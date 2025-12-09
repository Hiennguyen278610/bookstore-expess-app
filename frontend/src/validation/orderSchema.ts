import { z } from "zod";

export const ItemCartSchema = z.object({
  bookId: z.string().trim().min(1, "bookId is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  price: z.number().min(0, "Price must be >= 0"),
});

export const OrderPayloadSchema = z.object({
  items: z.array(ItemCartSchema).nonempty("Order must have at least 1 item"),
  addressId: z.string().trim().min(1, "addressId is required"),
  paymentMethod: z.enum(["COD", "BANK"])
})
// Types inferred từ schema
export type ItemCart = z.infer<typeof ItemCartSchema>;
export type OrderPayload = z.infer<typeof OrderPayloadSchema>;
