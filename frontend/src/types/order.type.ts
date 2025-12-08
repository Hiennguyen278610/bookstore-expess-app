interface customerId {
  _id: string;
  fullName: string;
  email: string;
  phone: string
}


export interface Order {
  _id: string;
  customerId : customerId;
  purchaseStatus: 'pending' | 'processing' | 'delivery' | 'completed' | 'canceled';
  paymentStatus: 'unpaid'| 'paid' | 'failed' | 'refunded';
  paymentMethod : 'cash' | 'creditCard' | 'payos';
  purchaseDate : Date;
  totalAmount : number
}

export interface OrderDetail {
  book_id: string;
  quantity: number;
  price: number;
  sub_total: number;
}

