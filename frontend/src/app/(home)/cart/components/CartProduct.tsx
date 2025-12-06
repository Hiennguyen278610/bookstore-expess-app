import { formatPrice } from "@/lib/utils"
import Image from "next/image";
import QuantityInput from "../../../../components/customer/QuantityInput";
import { CartItemProps } from "../../context/CartContext";
import { Trash } from "lucide-react";

interface CartItemComponentProps extends CartItemProps {
  onIncrease: () => void;
  onDecrease: () => void;
  onInputQuantity: (amount: number) => void;
  onRemove: () => void
}

const CartProduct = ({
  product, 
  quantity, 
  maxQuantity, 
  onIncrease, 
  onDecrease, 
  onInputQuantity,
  onRemove
}: CartItemComponentProps) => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    const num = Number(val)
    if (!isNaN(num)) {
      onInputQuantity(num)
    }
  }

  const handleBlur = () => {
    if (quantity < 1) onInputQuantity(1)
    else if (quantity > maxQuantity) onInputQuantity(maxQuantity)
  }

  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200">
      {/* Image and Product Info */}
      <div className="flex items-start gap-3 flex-1">
        {/* Image */}
        <div className="relative w-24 h-32 lg:w-28 lg:h-36 flex-shrink-0">
          <Image
            fill
            alt={product.name}
            className="w-full h-full object-cover rounded-lg shadow-sm"
            src={product.imgSrc}
          />
        </div>

        {/* Product details */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 text-lg lg:text-xl line-clamp-2 mb-2">
            {product.name}
          </h3>
          <p className="text-green-600 font-medium text-lg">
            {formatPrice(product.price)}
          </p>
          <p className="text-gray-500 text-sm mt-1">
            Còn lại: {maxQuantity} sản phẩm
          </p>
        </div>
      </div>
     
      {/* Quantity and Actions - Sử dụng grid để căn chỉnh chính xác */}
      <div className="w-full lg:w-auto">
        <div className="grid grid-cols-[auto_1fr] lg:grid-cols-[auto_120px] items-center gap-4 lg:gap-6">
          {/* Quantity Input and Remove */}
          <div className="flex flex-col items-center gap-2">
            <div className="bg-white border border-gray-300 rounded-lg shadow-sm">
              <QuantityInput 
                value={quantity}
                onIncrease={onIncrease}
                onDecrease={onDecrease}
                onChange={handleChange}
                onBlur={handleBlur}
                size="sm"
              />
            </div>
            
            {/* Remove Button */}
            <button
              onClick={onRemove}
              className="flex items-center gap-1 text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-all duration-200 w-full justify-center"
            >
              <Trash className="w-4 h-4" />
              <span className="text-sm font-medium">Xóa</span>
            </button>
          </div>          

          {/* Total Price - Cố định width để không bị lệch */}
          <div className="text-right min-w-[120px]">
            <h2 className="text-red-600 font-bold text-lg lg:text-xl whitespace-nowrap">
              {formatPrice(product.price * quantity)}
            </h2>
            <p className="text-gray-500 text-sm whitespace-nowrap">
              {formatPrice(product.price)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartProduct