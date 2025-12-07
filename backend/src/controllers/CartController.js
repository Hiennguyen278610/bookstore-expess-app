import {
  addItemToCart,
  clearCartService,
  getCartByCustomerId,
  removeItemFromCart,
  updateItemQuantity
} from '../services/CartService.js';
import User from "../models/User.js";
import {
  addItemToCart,
  clearCartService,
  getCartService,
  removeItemFromCart,
  updateItemQuantity,
} from "../services/CartService.js";

export async function addItem(req, res) {
  try {
    const { bookId, quantity } = req.body;
    const cart = await addItemToCart(bookId, req.user.id, quantity);
    if (!cart) {
      return res.status(401).json({ message: "Cart not found" });
    }
    return res.status(200).json(cart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function removeItem(req, res) {
  try {
    const { id } = req.params;
    const cart = await removeItemFromCart(id, req.user.id);
    if (!cart) {
      return res.status(401).json({ message: "Cart not found" });
    }
    return res.status(200).json(cart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function updateQuantity(req, res) {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const cart = await updateItemQuantity(id, req.user.id, quantity);
    if (!cart) {
      return res.status(401).json({ message: "Cart not found" });
    }
    return res.status(200).json(cart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function clearCart(req, res) {
  try {
    const cart = await clearCartService(req.user.id);
    if (!cart) {
      return res.status(401).json({ message: "Cart not found" });
    }
    return res.status(200).json(cart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function getCart(req, res) {
  try {
    const cart = await getCartService(req.user.id);
    if (!cart) {
      return res.status(401).json({ message: "Cart not found" });
    }
    return res.status(200).json(cart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
export async function getMyCart(req, res) {
  try {
    const customerId = req.user.id;
    const cart = await getCartByCustomerId(customerId);
    res.status(200).json(cart);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}
