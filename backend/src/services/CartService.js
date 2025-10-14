import Book from '../models/Book.js';
import Cart from '../models/Cart.js';


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
      items: [{ bookId, quantity, price: book.price }]
    });
  } else {
    const index = cart.items.findIndex(i => i.bookId.equals(bookId));
    if (index > -1) {
      cart.items[index].quantity += Number(quantity);
    } else {
      cart.items.push({ bookId, quantity, price: book.price });
    }
  }
  await cart.save();
  return cart;
}

export async function updateItemQuantity(bookId, customerId, quantity) {
  const cart = await Cart.findOne({ customerId });
  if (!cart) throw new Error('Cart not found');

  const index = cart.items.findIndex(i => i.bookId.equals(bookId));
  if (index === -1) throw new Error('Book not found in cart');

  cart.items[index].quantity = quantity;
  if (cart.items[index].quantity <= 0) {
    cart.items.splice(index, 1);
  }

  await cart.save();
  return cart;
}

export async function removeItemFromCart(bookId, customerId) {
  const cart = await Cart.findOne({ customerId });
  if (!cart) throw new Error('Cart not found');

  cart.items = cart.items.filter(i => !i.bookId.equals(bookId));
  await cart.save();
  return cart;
}

export async function clearCartService(customerId) {
  const cart = await Cart.findOne({ customerId });
  if (!cart) throw new Error('Cart not found');

  cart.items = [];
  await cart.save();
  return { message: 'Cart cleared successfully' };
}