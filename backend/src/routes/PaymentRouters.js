import express from 'express';
import { createPayment } from '../controllers/PaymentController.js';
import { auth } from '../middlewares/auth.js';
import { payos } from '../config/payosconfig.js';


const router = express.Router();

router.post('/create/:id', createPayment);
router.post('/receive-hook', async (req, res) => {
 console.log('📩 Webhook received:', req.body);
 const verified = payos.webhooks.verify(req.body);
 if (!verified) return res.status(400).send('invalid signature');
 res.status(200).send('ok');
});
export default router;