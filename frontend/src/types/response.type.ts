import { Book } from "./book.type";
import { Cart } from "./cart.type";

export interface Pagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiResponse<T> {
  success?: boolean; 
  message: string;
  data: T;
  pagination?: Pagination;
}



