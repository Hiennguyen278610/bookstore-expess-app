import express from "express";
import {
  createOrder,
  getAllOrders, getOrderByOrderCode,
  getOrderDetailById,
  getOrdersByCustomerId,
  updateOrder
} from '../controllers/OrderController.js';
import { auth } from "../middlewares/auth.js";
import { authorizeRoles } from "../middlewares/authorize.js";
import { checkEmptyBody } from "../middlewares/checkEmptyBody.js";

const router = express.Router();

// TODO: Uncomment khi deploy production
// router.use(auth);
router.use(checkEmptyBody);

router.get("/", getOrderByOrderCode)
router.get("/me", getOrdersByCustomerId);
router.post("/", createOrder);

//ADMIN ONLY
router.get("/", getAllOrders);
router.get("/:id", getOrderDetailById);
router.put("/:id", updateOrder);

// router.put('/status/:id', updateStatus);
// router.delete('/:id', deleteOrder);

export default router;
