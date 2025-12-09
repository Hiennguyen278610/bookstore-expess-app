import api from "@/lib/axios";
import { Cart } from "@/types/cart.type";

export const cartServices = {
  fetchCart: async (): Promise<Cart> => {
    console.log("fetching cart...");
    const response = await api.get<Cart>("/cart");
    console.log(response.data);
    return response.data;
  },

  addToCart: async (bookId: string, quantity: number = 1): Promise<Cart> => {
    try {
      const response = await api.post<Cart>("/cart", {
        bookId,
        quantity,
      });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  updateCart: async (cartDetailId: string, quantity: number): Promise<Cart> => {
    try {
      const response = await api.put<Cart>(`/cart/${cartDetailId}`, {
        quantity,
      });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  removeCartItem: async (cartDetailId: string): Promise<Cart> => {
    try {
      const response = await api.delete<Cart>(`/cart/${cartDetailId}`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  clearCart: async () => {
    try {
      const response = await api.delete("/cart");
      return response.status;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
