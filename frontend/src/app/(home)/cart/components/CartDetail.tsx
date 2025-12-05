import React from 'react'
import CartProduct from './CartProduct'
import { CartItemProps, useCart } from '../../context/CartContext'

const CartDetail = () => {
  const { cartItems, increaseQuantity, decreaseQuantity, inputQuantity, removeFromCart, getTotalQuantity } = useCart()

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Giỏ hàng</h3>
        <h4 className="text-gray-600 font-medium">{getTotalQuantity()} sản phẩm</h4>
      </div>
      
      <div className="space-y-4">
        {cartItems.length > 0 ? (
          cartItems.map((item: CartItemProps, index: number) => (
            <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
              <CartProduct 
                {...item}
                onIncrease={() => increaseQuantity(item.product.id)}
                onDecrease={() => decreaseQuantity(item.product.id)}
                onInputQuantity={(amount: number) => inputQuantity(item.product.id, amount)}
                onRemove={() => removeFromCart(item.product.id)}
              />
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">Giỏ hàng của bạn đang trống</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CartDetail