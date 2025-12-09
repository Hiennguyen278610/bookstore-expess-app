// stores/cartStore.ts (Simple version)
import { create } from "zustand";
import { CartStore } from "@/types/cart.type";
import { cartServices } from "@/services/cartServices";
import { toast } from "sonner";

export const useCartStore = create<CartStore>((set, get) => ({
  cart: null,
  loading: false,
  error: null,

  fetchCart: async () => {
    set({ loading: true, error: null });
    try {
      const result = await cartServices.fetchCart();
      // console.log("result : ", result);
      set({ cart: result, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch cart",
        loading: false,
      });
      console.log(error);
    }
  },

  addToCart: async (bookId: string, quantity: number) => {
    try {
      await cartServices.addToCart(bookId, quantity);
      toast.success("Đã thêm sản phẩm vào giỏ hàng");
      await get().fetchCart();
    } catch (error) {
      console.error("error when adding to cart");
    }
  },

  updateCartItem: async (cartDetailId: string, quantity: number) => {
    const prevCart = get().cart;

    if (!prevCart) {
      await get().fetchCart();
      return get().updateCartItem(cartDetailId, quantity);
    }

    const itemToUpdate = prevCart.items.find(
      (item) => item._id === cartDetailId
    );

    if (!itemToUpdate) {
      throw new Error("Không tìm thấy sản phẩm trong giỏ hàng");
    }

    if (quantity < 1) {
      throw new Error("Số lượng phải lớn hơn 0");
    }

    const quantityChange = quantity - itemToUpdate.quantity;
    const priceChange = itemToUpdate.price * quantityChange;

    const newItems = prevCart.items.map((item) =>
      item._id === cartDetailId ? { ...item, quantity } : item
    );

    const optimisticCart = {
      ...prevCart,
      items: newItems,
      totalQuantity: prevCart.totalQuantity + quantityChange,
      totalPrice: prevCart.totalPrice + priceChange,
      updatedAt: new Date().toISOString(),
    };

    // Cập nhật state trước khi gọi API
    set({ cart: optimisticCart });

    try {
      await cartServices.updateCart(cartDetailId, quantity);
    } catch (error) {
      console.error(" Update cart item API error:", error);

      //  ROLLBACK: Nếu API fail, fetch lại cart từ server
      try {
        await get().fetchCart();
      } catch (fetchError) {
        console.error(" Failed to rollback:", fetchError);
        // Fallback: revert về cart cũ
        set({ cart: prevCart });
      }

      throw error;
    }
  },

  removeCartItem: async (cartDetailId: string) => {
    const prevCart = get().cart;

    if (!prevCart) {
      throw new Error("Cart not loaded");
    }

    const itemToRemove = prevCart.items.find(
      (item) => item._id === cartDetailId
    );

    if (!itemToRemove) {
      throw new Error("Item not found in cart");
    }

    const removedItemInfo = {
      ...itemToRemove,
      removedAt: new Date().toISOString(),
    };

    const newItems = prevCart.items.filter((item) => item._id !== cartDetailId);
    const itemTotalPrice = itemToRemove.price * itemToRemove.quantity;

    const optimisticCart = {
      ...prevCart,
      items: newItems,
      totalQuantity: prevCart.totalQuantity - itemToRemove.quantity,
      totalPrice: prevCart.totalPrice - itemTotalPrice,
      updatedAt: new Date().toISOString(),
    };

    set({ cart: optimisticCart, loading: true });

    try {
      await cartServices.removeCartItem(cartDetailId);

      set({ loading: false });

      toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
    } catch (error) {
      console.error("Remove item error:", error);

      // ROLLBACK
      set({
        cart: prevCart,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to remove item",
      });

      throw error;
    }
  },

  clearCart: async () => {
    set({ loading: true, error: null });
    try {
      await cartServices.clearCart();
      await get().fetchCart();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to clear cart",
        loading: false,
      });
      throw error;
    }
  },
}));
