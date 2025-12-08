// Item trong giỏ hàng
export interface CartItem {
  _id: string;
  bookId: string;
  quantity: number;
  price: number;
}

// Giỏ hàng chính
export interface Cart {
  _id: string;
  customerId: string;
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
}

export interface CartStore {
  cart: Cart | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchCart: () => Promise<void>;
  addToCart: (bookId: string, quantity: number) => Promise<void>;
  updateCartItem: (bookId: string, quantity: number) => Promise<void>;
  removeCartItem: (cartDetailId: string) => Promise<void>;
  clearCart: () => Promise<void>;

}