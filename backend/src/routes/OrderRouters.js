import express from "express";
import {
  createOrder,
  getAllOrders, getOrderByOrderCode,
  getOrderDetailById,
  getOrdersByCustomerId, getTop10BestSellingBooks, getTop10NewestBooks,
  updateOrder
} from '../controllers/OrderController.js';
import { auth } from "../middlewares/auth.js";
import { authorizeRoles } from "../middlewares/authorize.js";
import { checkEmptyBody } from "../middlewares/checkEmptyBody.js";

const router = express.Router();

router.get("/best-selling/", getTop10BestSellingBooks)
router.get("/newest/", getTop10NewestBooks)

router.use(auth);
router.use(checkEmptyBody);

router.get("/code", getOrderByOrderCode)
router.get("/me", getOrdersByCustomerId);
router.post("/", createOrder);

//ADMIN ONLY
router.get("/", getAllOrders);
router.get("/:id", getOrderDetailById);
router.put("/:id", updateOrder);


// router.put('/status/:id', updateStatus);
// router.delete('/:id', deleteOrder);

export default router;
