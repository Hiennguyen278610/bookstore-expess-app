import api from "@/lib/axios";
import { Order } from "@/types/order.type";
import { ApiResponse } from "@/types/response.type";

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
};
