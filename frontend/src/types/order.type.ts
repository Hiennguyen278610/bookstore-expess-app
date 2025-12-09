interface customerId {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
}

export interface Order {
  _id: string;
  customerId: customerId;
  purchaseStatus:
    | "pending"
    | "processing"
    | "delivery"
    | "completed"
    | "canceled";
  paymentStatus: "unpaid" | "paid" | "failed" | "refunded";
  paymentMethod: "COD" | "CARD" | "PAYOS";
  purchaseDate: Date;
  totalAmount: number;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string
}


interface OrderDetail {
  _id: string;
  orderId: string;
  bookId: string;
  bookName: string;
  bookImage: string;
  price: number;
  quantity: number;
  total: number
}

export interface OrderWithDetails
  extends Pick<
    Order,
    | "_id"
    | "purchaseStatus"
    | "paymentStatus"
    | "paymentMethod"
    | "purchaseDate"
    | "totalAmount"
    | "receiverAddress"
    | "receiverName"
    | "receiverPhone"
  > {
    details: OrderDetail[];
    customerId: string;
    customerName: string;
    customerEmail: string;
  }
