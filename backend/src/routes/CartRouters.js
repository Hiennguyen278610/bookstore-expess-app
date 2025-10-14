import express from 'express';
import { addItem, clearCart, removeItem, updateQuantity } from '../controllers/CartController.js';
import { auth } from '../middlewares/auth.js';


const router = express.Router();

router.use(auth)

router.post("/", addItem);
router.put("/", updateQuantity) // chua test
router.delete("/:id", removeItem) // chua test
router.delete("/", clearCart) // chua test

export default router;
