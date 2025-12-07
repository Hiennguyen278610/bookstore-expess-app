import Book from "../models/Book.js";
import Cart from "../models/Cart.js";

// chua cap nhat lai quantity book nhé
export async function addItemToCart(bookId, customerId, quantity) {
  const book = await Book.findById(bookId);
  if (!book) {
    throw new Error(`Book with id ${bookId} not found`);
  }
  let cart = await Cart.findOne({ customerId: customerId });
  if (!cart) {
    cart = new Cart({
      customerId: customerId,
      items: [{ bookId, quantity, price: book.price }],
    });
  } else {
    const index = cart.items.findIndex((i) => i.bookId.equals(bookId));
    if (index > -1) {
      cart.items[index].quantity += Number(quantity);
    } else {
      cart.items.push({ bookId, quantity, price: book.price });
    }
  }
  await cart.save();
  return cart;
}

export async function updateItemQuantity(cartDetailId, customerId, quantity) {
  const cart = await Cart.findOne({ customerId });
  if (!cart) throw new Error("Cart not found");

  const index = cart.items.findIndex(
    (item) => item._id && item._id.toString() === cartDetailId
  );

  if (index === -1) {
    throw new Error("Item not found in cart");
  }

  if (quantity < 1) {
    throw new Error("Quantity must be at least 1");
  }

  cart.items[index].quantity = quantity;

  cart.totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  cart.totalPrice = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  await cart.save();

  return {
    cart,
    updatedItem: cart.items[index],
    message: "Item quantity updated successfully",
  };
}

export async function removeItemFromCart(cartDetailId, customerId) {
  const cart = await Cart.findOne({ customerId });
  if (!cart) throw new Error("Cart not found");

  const itemIndex = cart.items.findIndex(
    (item) => item._id && item._id.toString() === cartDetailId
  );

  if (itemIndex === -1) {
    throw new Error("Item not found in cart");
  }

  const removedItem = cart.items[itemIndex];
  cart.items.splice(itemIndex, 1);

  cart.totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  cart.totalPrice = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  await cart.save();

  return {
    cart,
    removedItem,
    message: "Item removed successfully",
  };
}
export async function clearCartService(customerId) {
  const cart = await Cart.findOne({ customerId });
  if (!cart) throw new Error("Cart not found");

  cart.items = [];
  await cart.save();
  return { message: "Cart cleared successfully" };
}

export async function getCartService(customerId) {
  const cart = await Cart.findOne({ customerId });
  if (!cart) throw new Error("Cart not found");
  return cart;
}
