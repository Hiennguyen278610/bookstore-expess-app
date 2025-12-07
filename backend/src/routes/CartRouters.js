import express from 'express';
import { addItem, clearCart, getMyCart, removeItem, updateQuantity } from '../controllers/CartController.js';
import { auth } from '../middlewares/auth.js';
import { checkEmptyBody } from '../middlewares/checkEmptyBody.js';


const router = express.Router();

router.use(auth)
router.use(checkEmptyBody)

router.get("/", getMyCart)
router.post("/", addItem);
router.put("/", updateQuantity) // chua test
router.delete("/:id", removeItem) // chua test
router.delete("/", clearCart) // chua test

export default router;
