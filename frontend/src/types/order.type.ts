
export interface Order {
  id: string;
  user_id: string;
  payment_method: "cash" | "card" | "banking";
  purchase_date: string; // ISO string
  purchase_status: "pending" | "processing" | "delivered" | "cancelled";
  items: OrderItem[];
  total_price: number;
}

export interface OrderItem {
  book_id: string;
  quantity: number;
  price: number;
  sub_total: number;
}