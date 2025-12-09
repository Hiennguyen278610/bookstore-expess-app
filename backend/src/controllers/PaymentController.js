import { cancelPaymentService, createPaymentService, handlePayosWebhook } from '../services/PaymentService.js';
import cart from '../models/Cart.js';
import User from '../models/User.js';

export async function createPayment(req, res) {
  try {
    const payment = await createPaymentService(req.params.id);
    // res.redirect(payment.checkoutUrl);
    return res.status(200).json({ok: true, payment});
  }catch (err){
    res.status(500).json({ok: false, message: err.message});
  }
}
export async function webhookController(req, res){
  try {
    const result = await handlePayosWebhook(req.body)
    console.log(result);
    res.status(200).json(result)
  }catch (err){
    console.log("Webhook err: " + err.message);
    res.status(400).json({message: err.message})
  }
}
export async function cancelPayment(req, res){
  try {
    const order = await cancelPaymentService(req.params.id, req.user.id);
    return res.status(200).json(order);
  }catch (err){
    res.status(400).json({message: err.message});
  }
}