import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import QuantityInput from "../../../../components/customer/QuantityInput";
import { Trash } from "lucide-react";
import { CartItem } from "@/types/cart.type";
import useSWR from "swr";
import { bookServices } from "@/services/bookServices";

interface CartItemComponentProps {
  bookId: string;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onInputQuantity: (amount: number) => void;
  onRemove: () => void;
}

const CartProduct = ({
  bookId,
  quantity,
  onIncrease,
  onDecrease,
  onInputQuantity,
  onRemove,
}: CartItemComponentProps) => {
  // Fetch book info
  const { data: book, isLoading } = useSWR(
    bookId ? `/books/${bookId}` : null,
    () => bookServices.getBookById(bookId)
  );

  const maxQuantity = book?.quantity ?? 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = Number(e.target.value);
    if (!isNaN(num) && num >= 1 && num <= maxQuantity) {
      onInputQuantity(num);
    }
  };

  const handleBlur = () => {
    if (quantity < 1) {
      onInputQuantity(1);
    } else if (quantity > maxQuantity) {
      onInputQuantity(maxQuantity);
    }
  };

  // Các hàm xử lý nút + và - với validation
  const handleIncrease = () => {
    if (quantity < maxQuantity) {
      onIncrease();
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      onDecrease();
    }
  };


  /** Loading fallback */
  if (isLoading || !book) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg animate-pulse">
        <p className="text-gray-500">Đang tải sản phẩm...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200">
      {/* Image + Info */}
      <div className="flex items-start gap-3 flex-1">
        <div className="relative w-24 h-32 lg:w-28 lg:h-36 flex-shrink-0">
          <Image
            fill
            alt={book.name}
            className="w-full h-full object-cover rounded-lg shadow-sm"
            src={book.imageUrl[0]}
          />
        </div>

        {/* Book Details */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 text-lg lg:text-xl line-clamp-2 mb-2">
            {book.name}
          </h3>
          <p className="text-green-600 font-medium text-lg">
            {formatPrice(book.price)}
          </p>
          <p className="text-gray-500 text-sm mt-1">
            Còn lại: {maxQuantity} sản phẩm
          </p>
          
          {/* Hiển thị cảnh báo nếu đã đạt giới hạn */}
          {quantity >= maxQuantity && (
            <p className="text-red-500 text-sm font-medium mt-1">
              Đã đạt giới hạn mua tối đa
            </p>
          )}
        </div>
      </div>

      {/* Quantity + Remove + Price */}
      <div className="w-full lg:w-auto">
        <div className="grid grid-cols-[auto_1fr] lg:grid-cols-[auto_120px] items-center gap-4 lg:gap-6">
          
          {/* Quantity + Remove */}
          <div className="flex flex-col items-center gap-2">
            <div className="bg-white border border-gray-300 rounded-lg shadow-sm">
              <QuantityInput
                value={quantity}
                onIncrease={handleIncrease}  
                onDecrease={handleDecrease}  
                onChange={handleChange}
                onBlur={handleBlur}
                size="sm"
              />
            </div>

            <button
              onClick={onRemove}
              className="flex items-center gap-1 text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-all duration-200 w-full justify-center"
            >
              <Trash className="w-4 h-4" />
              <span className="text-sm font-medium">Xóa</span>
            </button>
          </div>

          {/* Total Price */}
          <div className="text-right min-w-[120px]">
            <h2 className="text-red-600 font-bold text-lg lg:text-xl whitespace-nowrap">
              {formatPrice(book.price * quantity)}
            </h2>
            <p className="text-gray-500 text-sm whitespace-nowrap">
              {formatPrice(book.price)} × {quantity}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartProduct;