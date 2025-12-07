import { baseUrl } from "@/constants";
import { Category } from "@/types/category.type";
import axios from '@/lib/axios';

export const categoryServices = {
  getAllCategories: async (): Promise<Category[]> => {
    try {
      const response = await axios.get<Category[]>(`${baseUrl}/categories`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
