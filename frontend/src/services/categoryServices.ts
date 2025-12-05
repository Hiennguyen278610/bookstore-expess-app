import { baseUrl } from "@/constants";
import publicApi from "@/lib/axios";
import { Category } from "@/types/category.type";

export const categoryServices = {
  getAllCategories: async (): Promise<Category[]> => {
    try {
      const response = await publicApi.get<Category[]>(`${baseUrl}/categories`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
