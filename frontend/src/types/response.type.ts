import { Book } from "./book.type";

export interface Pagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export interface ApiProductResponse<T = any> {
  success?: boolean; 
  message: string;
  data: T;
  pagination?: Pagination;
}


