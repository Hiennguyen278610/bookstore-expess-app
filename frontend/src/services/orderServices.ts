import api from "@/lib/axios";
import { Order, OrderWithDetails } from "@/types/order.type";
import { ApiResponse } from "@/types/response.type";
import useSWR from "swr";
import { OrderPayload } from '@/validation/orderSchema';

export const orderServices = {
  getAllOrders: async (
    page: number = 1,
    limit: number = 10,
    purchaseStatus?: string,
    startDate?: string,
    endDate?: string
  ): Promise<ApiResponse<Order[]>> => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (purchaseStatus) {
      params.append("purchaseStatus", purchaseStatus);
    }
    if (startDate) {
      params.append("startDate", startDate);
    }
    if (endDate) {
      params.append("endDate", endDate);
    }

    try {
      const response = await api.get<ApiResponse<Order[]>>(`/orders`, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  updateOrder: async (
    orderId: string,
    data: {
      purchaseStatus?: Order["purchaseStatus"];
      paymentStatus?: Order["paymentStatus"];
    }
  ): Promise<Order> => {
    try {
      const result = await api.put<Order>(`/orders/${orderId}`, data);
      return result.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  createOrder: async (details: OrderPayload) => {
    return await api.post("/orders", details).then((res) => res.data);
  },

  getOrderById: (id: string) => {
    const { data, error, isLoading, mutate } = useSWR(
      `${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`
    );
    return {
      order: data,
      error,
      isLoading,
      mutate,
    };
  },

  getOrderDetailById: async (orderId: string): Promise<OrderWithDetails> => {
    try {
      const response = await api.get<OrderWithDetails>(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};