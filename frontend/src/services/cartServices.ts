import { baseUrl } from "@/constants";
import { customerApi } from "@/lib/axios";
import { Cart } from "@/types/cart.type";
import { ApiResponse } from "@/types/response.type";

export const cartServices = {
  fetchCart: async (): Promise<ApiResponse<Cart>> => {
    try {
      const response = await fetch(`${baseUrl}/cart`, {
        method: "GET",
        credentials: "include", // để gửi cookie HttpOnly
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data: ApiResponse<Cart> = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  addToCart: async (
    bookId: string,
    quantity: number = 1
  ): Promise<ApiResponse<Cart>> => {
    try {
      const response = await customerApi.post<ApiResponse<Cart>>("/cart", {
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
      const response = await customerApi.put<ApiResponse<Cart>>(
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
      const response = await customerApi.delete<ApiResponse<Cart>>(
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
      const response = await customerApi.delete("/cart");
      return response.status;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
