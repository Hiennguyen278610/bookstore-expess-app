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
  categoryId : Category;
  publisherId: Publisher;
  authors: Author[]
  imageUrl : string[];
  quantity: number;
  price: number;

}
