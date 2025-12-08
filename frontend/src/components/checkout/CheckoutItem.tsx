"use client";

import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import useSWR from "swr";
import { bookServices } from "@/services/bookServices";

interface CheckoutItemProps {
  bookId: string;
  quantity: number;
}

const CheckoutItem = ({ bookId, quantity }: CheckoutItemProps) => {
  const { data: book, isLoading } = useSWR(
    bookId ? `/books/${bookId}` : null,
    () => bookServices.getBookById(bookId)
  );

  if (isLoading || !book) {
    return <div className="h-20 w-full bg-gray-100 animate-pulse rounded-md mb-2"></div>;
  }

  return (
    <div className="flex items-center gap-4 py-4 border-b last:border-0">
      <div className="relative w-16 h-20 flex-shrink-0 border rounded-md overflow-hidden">
        <Image
          fill
          alt={book.name}
          className="object-cover"
          src={book.imageUrl[0]}
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-800 text-sm line-clamp-2">
          {book.name}
        </h3>
        <p className="text-gray-500 text-xs mt-1">Số lượng: x{quantity}</p>
      </div>

      <div className="text-right">
        <p className="text-red-600 font-semibold text-sm">
          {formatPrice(book.price * quantity)}
        </p>
      </div>
    </div>
  );
};

export default CheckoutItem;