import express from 'express';
import { cancelPayment, createPayment, webhookController } from '../controllers/PaymentController.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();

router.post('/create/:id',auth, createPayment);
router.post('/receive-hook', webhookController);
router.put('/cancel/:id', auth, cancelPayment)

export default router;