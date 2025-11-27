import type { CartItem } from "./cartitem.type";

export interface Cart {
  id: string;
  customer_id: string;
  items: CartItem[];
  total_quantity: number;
  total_price: number;
}
