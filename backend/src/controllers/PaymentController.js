import { createPaymentService } from '../services/PaymentService.js';

export async function createPayment(req, res) {
  try {
    const payment = await createPaymentService(req.params.id);
    // res.redirect(payment.checkoutUrl);
    return res.status(200).json({ok: true, payment});
  }catch (err){
    res.status(500).json({ok: false, message: err.message});
  }
}