// stores/cartStore.ts (Simple version)
import { create } from "zustand";
import { CartStore } from "@/types/cart.type";
import { cartServices } from "@/services/cartServices";


export const useCartStore = create<CartStore>((set, get) => ({
  cart: null,
  loading: false,
  error: null,

  fetchCart: async () => {
    set({ loading: true, error: null });
    try {
      const result = await cartServices.fetchCart();
      set({ cart: result.data, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch cart",
        loading: false,
      });
    }
  },

  addToCart: async (bookId: string, quantity: number) => {
    set({ loading: true, error: null });
    try {
      const result = await cartServices.addToCart(bookId, quantity);
      set({ cart: result.data, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to add to cart",
        loading: false,
      });
      throw error;
    }
  },

  updateCartItem: async (id, quantity) => {
    const result = await cartServices.updateCart(id, quantity);
    set({ cart: result.data }); 
  },

  removeCartItem: async (cartDetailId: string) => {
    set({ loading: true, error: null });
    try {
      const result = await cartServices.removeCartItem(cartDetailId);
      set({ cart: result.data, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to remove item",
        loading: false,
      });
      throw error;
    }
  },

  clearCart: async () => {
    set({ loading: true, error: null });
    try {
      const cart = await cartServices.clearCart();
      set({ cart: null, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to clear cart",
        loading: false,
      });
      throw error;
    }
  },

  // Computed values
  get cartCount() {
    return get().cart?.totalQuantity || 0;
  },

  get cartTotal() {
    return get().cart?.totalPrice || 0;
  },

  get cartItems() {
    return get().cart?.items || [];
  },
}));
