import { Category } from "@/types/category.type";
import api from '@/lib/axios';

export const categoryServices = {
  getAllCategories: async (): Promise<Category[]> => {
    try {
      const response = await api.get<Category[]>('/categories');
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getCategoryBySlug: async (slug: string): Promise<Category> => {
    try {
      const response = await api.get<Category>(`/categories/${slug}`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
