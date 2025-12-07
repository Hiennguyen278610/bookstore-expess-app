import { baseUrl } from "@/constants";
import { publicApi } from "@/lib/axios";
import { Category } from "@/types/category.type";

export const categoryServices = {
  getAllCategories: async (): Promise<Category[]> => {
    try {
      const response = await publicApi.get<Category[]>('/categories');
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getCategoryBySlug: async (slug: string): Promise<Category> => {
    try {
      const response = await publicApi.get<Category>(`/categories/${slug}`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
