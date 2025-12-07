import api from "@/lib/axios";
import { Publisher } from "@/types/publisher.type";

export const publisherServices = {
  getAllPublishers: async (): Promise<Publisher[]> => {
    try {
      const response = await api.get<Publisher[]>("/publishers");
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
