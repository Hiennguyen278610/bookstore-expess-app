import api from '@/lib/axios';
import { Cart } from '@/types/cart.type';
import { ApiResponse } from '@/types/response.type';

export const cartServices = {
  fetchCart: async (): Promise<ApiResponse<Cart>> => {
    return await api.get<ApiResponse<Cart>>('/cart').then(res => res.data);
  },

  addToCart: async (
    bookId: string,
    quantity: number = 1
  ): Promise<ApiResponse<Cart>> => {
    try {
      const response = await api.post<ApiResponse<Cart>>('/cart', {
        bookId,
        quantity,
      });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  updateCart: async (
    cartDetailId: string,
    quantity: number
  ): Promise<ApiResponse<Cart>> => {
    try {
      const response = await api.put<ApiResponse<Cart>>(
        `/cart/${cartDetailId}`,
        {
          quantity,
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  removeCartItem: async (cartDetailId: string): Promise<ApiResponse<Cart>> => {
    try {
      const response = await api.delete<ApiResponse<Cart>>(
        `/cart/${cartDetailId}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  clearCart: async () => {
    try {
      const response = await api.delete('/cart');
      return response.status;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
