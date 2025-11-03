import Order from '../models/Order.js';
import { payos } from '../config/payosconfig.js';
import dotenv from 'dotenv';
import OrderDetail from '../models/OrderDetail.js';

dotenv.config();

export async function createPaymentService(orderId) {
  const order = await Order.findById(orderId);
  const details = await OrderDetail.find({ orderId: order._id });
  if (!order) {
    throw new Error(`Order with id ${orderId} not found`);
  }
  const payload = {
    amount: order.totalAmount,
    description: `Đơn hàng ${Number(String(Date.now()).slice(-6))}`,
    orderCode: Number(String(Date.now()).slice(-6)),
    returnUrl: `${process.env.FRONTEND_URL}/payment/return`,
    cancelUrl: `${process.env.FRONTEND_URL}/payment/cancel`,
    items: details.map(detail => ({
      name: detail.bookId,
      price: detail.price,
      quantity: detail.quantity
    }))
  };
  const payment = await payos.paymentRequests.create(payload);
  order.paymentLink = payment.checkoutUrl;
  order.payosOrderId = payment.orderCode
  order.paymentMethod = 'payos';
  order.purchaseStatus = 'processing';
  await order.save();
  return payment;
}
//checkoutURL de thanh toan
// {
//   "ok": true,
//   "payment": {
//   "bin": "970422",
//     "accountNumber": "VQRQAFBNN8838",
//     "accountName": "HOANG DINH PHU QUY",
//     "amount": 4000,
//     "description": "Don hang 340793",
//     "orderCode": 340793,
//     "currency": "VND",
//     "paymentLinkId": "a9a4dcc03f794fb29af9ec8e53eb50e1",
//     "status": "PENDING",
//     "checkoutUrl": "https://pay.payos.vn/web/a9a4dcc03f794fb29af9ec8e53eb50e1",
//     "qrCode": "00020101021238570010A000000727012700069704220113VQRQAFBNN88380208QRIBFTTA5303704540440005802VN62190815Don hang 3407936304F391"
// }
// }
//https://pay.payos.vn/web/a9a4dcc03f794fb29af9ec8e53eb50e1
// tra ve frontend
// code = 00 success
// paymentLinkId = a9a4dcc03f794fb29af9ec8e53eb50e1 // tim hoa don theo id nay xong set status = PAID va purchaseStatus la delivery
// cancel = false
// status = PAID
// orderCode = 340793
//http://localhost:3000/payment/return?code=00&id=a9a4dcc03f794fb29af9ec8e53eb50e1&cancel=false&status=PAID&orderCode=340793

