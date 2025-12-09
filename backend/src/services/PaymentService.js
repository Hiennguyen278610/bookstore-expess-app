import Order from '../models/Order.js';
import { payos } from '../config/payosconfig.js';
import OrderDetail from '../models/OrderDetail.js';
import Book from '../models/Book.js';
import { buildOrderCanceledMail, buildOrderFailedMail, buildOrderSuccessMail } from '../utils/MailTemplate.js';
import { sendMail } from './mail.service.js';
import User from '../models/User.js';

export async function createPaymentService(orderId) {
  const order = await Order.findById(orderId);
  const details = await OrderDetail.find({ orderId: order._id });
  if (!order) {
    throw new Error(`Order with id ${orderId} not found`);
  }
  const items = [];
  for (const detail of details) {
    const book = await Book.findById(detail.bookId);
    items.push({
      name: book.name,
      price: detail.price,
      quantity: detail.quantity
    });
  }
  const payload = {
    amount: order.totalAmount,
    description: `Đơn hàng ${Number(String(Date.now()).slice(-6))}`,
    orderCode: Number(String(Date.now()).slice(-6)),
    returnUrl: `${process.env.FRONTEND_URL}/payment/return`,
    cancelUrl: `${process.env.FRONTEND_URL}/payment/cancel`,
    items: items
  };
  const payment = await payos.paymentRequests.create(payload);
  order.paymentLink = payment.checkoutUrl;
  order.payosOrderId = payment.orderCode;
  order.paymentLinkId = payment.paymentLinkId;
  order.paymentMethod = 'payos';
  order.purchaseStatus = 'processing';
  await order.save();
  return payment;
}

export async function handlePayosWebhook(payload) {
  const verified = payos.webhooks.verify(payload);
  if (!verified) throw new Error('Invalid Signature');
  const payment = payload.data;
  const order = await Order.findOne({ payosOrderId: payment.orderCode });
  if (!order) throw new Error('Order not found');
  if (payment.code === '00' && payment.desc === 'success') {
    order.purchaseStatus = 'delivery';
    order.paymentStatus = 'paid';
    await order.save();

    console.log(`Đơn hàng ${payment.orderCode} thanh toán thành công`);
    const { subject, html} = await buildOrderSuccessMail(order)
    await notifyAdminAndUser(order, subject, html);
  } else {
    order.purchaseStatus = 'canceled';
    order.paymentStatus = 'failed';
    await order.save();

    console.log(`Đơn hàng ${payment.orderCode} thanh toán thất bại`);
    const { subject, html} = buildOrderFailedMail(order)
    await notifyAdminAndUser(order, subject, html);
  }
  return { message: 'Webhook processed successfully' };
}

export async function cancelPaymentService(orderId, customerId) {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error(`Order with id ${orderId} not found`);
  }
  if (order.customerId.toString() !== customerId.toString()) {
    throw new Error(`You are not authorize to cancel this order`);
  }
  order.purchaseStatus = 'canceled';
  order.paymentStatus = 'failed';
  await order.save();
  const { subject, html } = await buildOrderCanceledMail(order);
  await notifyAdminAndUser(order, subject, html);

  console.log(`Người dùng đã hủy đơn hàng ${order.payosOrderId}`);
  return order;
}
async function notifyAdminAndUser(order, subject, html) {
  try {
    await sendMail(process.env.MAIL_ADMIN, subject, html);
  } catch (err) {
    console.error('Không gửi được mail cho admin:', err.message);
  }

  try {
    const user = await User.findById(order.customerId);
    if (user?.email) {
      await sendMail(user.email, subject, html);
    }
  } catch (err) {
    console.error('Không gửi được mail cho khách hàng:', err.message);
  }
}
// tra ve frontend
// code = 00 success
// paymentLinkId = a9a4dcc03f794fb29af9ec8e53eb50e1 // tim hoa don theo id nay xong set status = PAID va purchaseStatus la delivery
// cancel = false
// status = PAID
// orderCode = 340793
//http://localhost:3000/payment/return?code=00&id=a9a4dcc03f794fb29af9ec8e53eb50e1&cancel=false&status=PAID&orderCode=340793
//cancel
// http://localhost:3000/payment/cancel?code=00&id=16b1651d3e18422c801651f54375e122&cancel=true&status=CANCELLED&orderCode=604838