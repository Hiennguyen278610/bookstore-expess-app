import User from '../models/User.js';
import { addItemToCart, clearCartService, removeItemFromCart, updateItemQuantity } from '../services/CartService.js';

export async function addItem(req, res) {
  try {
    const dataUser = req.user;
    const user = await User.findOne({ username: dataUser.username });
    const { bookId, quantity } = req.body;
    const cart = await addItemToCart(bookId, user._id, quantity);
    if (!cart) {
      return res.status(401).json({ message: 'Cart not found' });
    }
    return res.status(200).json(cart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function removeItem(req, res) {
  try {
    const dataUser = req.user;
    const user = await User.findOne({ username: dataUser.username });
    const { bookId } = req.body;
    const cart = await removeItemFromCart(bookId, user._id);
    if (!cart) {
      return res.status(401).json({ message: 'Cart not found' });
    }
    return res.status(200).json(cart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function updateQuantity(req, res) {
  try {
    const dataUser = req.user;
    const user = await User.findOne({ username: dataUser.username });
    const { bookId, quantity } = req.body;
    const cart = await updateItemQuantity(bookId, user._id, quantity);
    if (!cart) {
      return res.status(401).json({ message: 'Cart not found' });
    }
    return res.status(200).json(cart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function clearCart(req, res) {
  try {
    const dataUser = req.user;
    const user = await User.findOne({ username: dataUser.username });
    const cart = await clearCartService(user._id);
    if (!cart) {
      return res.status(401).json({ message: 'Cart not found' });
    }
    return res.status(200).json(cart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}