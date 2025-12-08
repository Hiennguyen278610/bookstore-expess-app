import express from 'express';
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrderById, getOrders,
  getOrdersByStatus,
  updateOrder,
  updateStatus
} from '../controllers/OrderController.js';
import { auth } from '../middlewares/auth.js';
import { authorizeRoles } from '../middlewares/authorize.js';
import { checkEmptyBody } from '../middlewares/checkEmptyBody.js';

const router = express.Router();

router.use(auth);
router.use(checkEmptyBody)

router.get('/:id', getOrderById);
router.get('/status', getOrdersByStatus);
router.post('/', createOrder);
router.post('/me', getAllOrders);
router.put('/:id',authorizeRoles("admin"), updateOrder);
router.put('/status/:id', updateStatus);
router.delete('/:id', deleteOrder);
router.get("/",authorizeRoles("admin"), getOrders);

export default router;