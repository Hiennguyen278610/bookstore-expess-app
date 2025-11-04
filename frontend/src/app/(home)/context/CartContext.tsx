import { ProductCardProps, products } from "@/constants/user.index";
import React, { useContext, useReducer } from "react";

export interface CartItemProps {
  product: ProductCardProps;
  quantity: number;
  maxQuantity: number;
}

interface CartContextType {
  cartItems: CartItemProps[];
  addToCart: (item: CartItemProps) => void;
  removeFromCart: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  inputQuantity: (id: string, amount: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalQuantity: () => number;
}

const CartContext = React.createContext<CartContextType | null>(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItemProps }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "INCREASE"; payload: string }
  | { type: "DECREASE"; payload: string }
  | { type: "INPUT_QUANTITY"; payload: { id: string; amount: number } }
  | { type: "CLEAR" };

const initialState : CartItemProps[] = [
    {product: products[0], quantity: 2, maxQuantity:3666},
    {product: products[1], quantity: 2, maxQuantity:3666},
    {product: products[2], quantity: 2, maxQuantity:3666},
]

const cartReducer = (state = initialState, action: CartAction) => {
    switch(action.type) {
        case "ADD_ITEM" : {
            const existingItem = state.find(i => i.product.id === action.payload.product.id);
            if(existingItem){
                return state.map(item => item.product.id === action.payload.product.id 
                    ? {...item , quantity: item.quantity + action.payload.quantity}
                    : item
                )
            }
            return [...state, action.payload]
        }

        case "REMOVE_ITEM": {
            return state.filter((item: CartItemProps) => item.product.id !== action.payload )
        }

        case "INCREASE":
            return state.map(
                (item) => item.product.id === action.payload 
                ? {...item, quantity: Math.min(item.quantity+1, 363636)}  //sau nay` thay 363636 = maxStock
                : item
            )

        //Bấm nút trừ => Giảm 1
        case "DECREASE":
            return state.map(
                (item) => item.product.id === action.payload
                ? {...item, quantity: Math.max(item.quantity-1 , 1) }
                : item
            )

       case "INPUT_QUANTITY":
            return state.map(
                (item) => item.product.id === action.payload.id
                ? { ...item, quantity: Math.min(action.payload.amount, item.maxQuantity ?? 9999) }
                : item
            )

        // Xóa giỏ hàng
        case "CLEAR":
            return [] as CartItemProps[]

        default:
            return state

    }
}


export const CartProvider = ({children} : {children: React.ReactNode}) => {

    const [state, dispatch] = useReducer(cartReducer, initialState)

    const addToCart = (item : CartItemProps) => {
        dispatch({type: "ADD_ITEM", payload:item})
    }

    const removeFromCart = (id : string) => {
        dispatch({type:"REMOVE_ITEM", payload: id})
    }

    const increaseQuantity = (id: string) => {
        dispatch({type:"INCREASE", payload: id})
    }

    const decreaseQuantity = (id: string) => {
        dispatch({type:"DECREASE", payload: id})
    }
    
    const inputQuantity = (id: string, amount: number) => {
        dispatch({type:"INPUT_QUANTITY", payload: {id, amount}})
    }

    const clearCart = () => {
        dispatch({type:"CLEAR"})
    }

    const getTotalPrice = () => state.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    const getTotalQuantity = () => state.reduce((sum, item) => sum + item.quantity, 0);

    return (
    <CartContext.Provider 
        value={{
        cartItems: state,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        inputQuantity,
        clearCart,
        getTotalPrice,
        getTotalQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}