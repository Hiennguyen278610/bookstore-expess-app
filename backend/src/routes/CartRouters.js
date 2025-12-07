import express from 'express';
import { addItem, clearCart, getCart, removeItem, updateQuantity } from '../controllers/CartController.js';
import { auth } from '../middlewares/auth.js';
import { checkEmptyBody } from '../middlewares/checkEmptyBody.js';


const router = express.Router();

router.use(auth)
router.use(checkEmptyBody)

router.get("/", getCart)
router.post("/", addItem);
router.put("/:id", updateQuantity) // :id = cartDetailId
router.delete("/:id", removeItem) // :id = cartDetailId
router.delete("/", clearCart) 

export default router;
