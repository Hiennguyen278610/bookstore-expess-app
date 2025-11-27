

export interface SupplyReceipt {
  id: string;
  supplier_id: string;
  admin_id: string;
  supply_date: string;
  supply_status: "pending" | "completed" | "cancelled";
  items: SupplyItem[];
  total_amount: number;
}

export interface SupplyItem {
  book_id: string;
  import_price: number;
  quantity: number;
  sub_amount: number;
}