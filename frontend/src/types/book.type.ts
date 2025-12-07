import { Author } from "./author.type";
import { Category } from "./category.type";
import { Publisher } from "./publisher.type";

export interface Book_2 {
  id: string;
  name: string;
  category_id: string;
  publisher_id: string;
  imageUrl: string;
  quantity: number;
  price: number;
}


export interface Book {
  _id: string;
  name: string;
  categoryId: {
    _id: string;
    name: string;
  };
  publisherId: {
    _id: string;
    name: string;
  };
  authors: {
    _id: string;
    name: string;
  }[];
  imageUrl: string[];
  mainImage: string;
  quantity: number;
  price: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BooksResponse {
  message: string;
  data: Book[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
