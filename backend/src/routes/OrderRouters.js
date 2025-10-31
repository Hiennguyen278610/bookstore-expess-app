import express from 'express';
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrderById,
  getOrdersByStatus,
  updateOrder,
  updateStatus
} from '../controllers/OrderController.js';
import { auth } from '../middlewares/auth.js';
import { authorizeRoles } from '../middlewares/authorize.js';

const router = express.Router();

router.use(auth);

router.get('/:id', authorizeRoles('admin'), getOrderById);
router.get('/status', getOrdersByStatus);
router.post('/', createOrder);
router.post('/me', getAllOrders);
router.put('/:id',authorizeRoles("admin"), updateOrder);
router.put('/status/:id', updateStatus);
router.delete('/:id', deleteOrder);

export default router;