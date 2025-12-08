"use client";

import { formatPrice } from "@/lib/utils";
import { bookServices } from "@/services/bookServices";
import Image from "next/image";
import useSWR from "swr";

interface OrderItemProps {
  bookId: string;
  quantity: number;
  price: number;
}

const OrderItem = ({ bookId, quantity, price }: OrderItemProps) => {
  const { data: book, isLoading } = useSWR(
    bookId ? `/books/${bookId}` : null,
    () => bookServices.getBookById(bookId)
  );

  if (isLoading || !book) {
    return <div className="h-20 bg-gray-100 rounded animate-pulse mb-4"></div>;
  }

  return (
    <div className="flex gap-4 py-4 border-b last:border-0">
      <div className="relative w-16 h-20 flex-shrink-0 border rounded overflow-hidden">
        <Image
          src={book.imageUrl[0]}
          alt={book.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-gray-800 line-clamp-1">{book.name}</h4>
        <div className="text-sm text-gray-500 mt-1">
          Số lượng: <span className="font-medium text-gray-900">{quantity}</span>
        </div>
        <div className="text-sm font-medium text-red-600 mt-1">
          {formatPrice(price)}
          <span className="text-gray-400 font-normal text-xs ml-2">
                (Tổng: {formatPrice(price * quantity)})
            </span>
        </div>
      </div>
    </div>
  );
};

export default OrderItem;