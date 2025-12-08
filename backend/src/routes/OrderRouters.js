import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderDetailById,
  getOrdersByCustomerId,
  updateOrder,
} from "../controllers/OrderController.js";
import { auth } from "../middlewares/auth.js";
import { authorizeRoles } from "../middlewares/authorize.js";
import { checkEmptyBody } from "../middlewares/checkEmptyBody.js";

const router = express.Router();

router.use(auth);
router.use(checkEmptyBody);

router.get("/me", getOrdersByCustomerId);
router.post("/", createOrder);

//ADMIN ONLY
router.get("/", authorizeRoles("admin"), getAllOrders);
router.get("/:id", authorizeRoles("admin"), getOrderDetailById);
router.put("/:id", authorizeRoles("admin"), updateOrder);

// router.put('/status/:id', updateStatus);
// router.delete('/:id', deleteOrder);

export default router;
