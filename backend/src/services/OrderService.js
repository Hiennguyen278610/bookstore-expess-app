import Order from '../models/Order.js';
import OrderDetail from '../models/OrderDetail.js';
import Book from '../models/Book.js';
import mongoose from 'mongoose';
import book from '../models/Book.js';

export async function createOrderService(customerId, paymentMethod, details) {
  const order = await Order.create({
    customerId: customerId,
    paymentMethod: paymentMethod
  });
  if (details && details.length > 0) {
    await Promise.all(
      details.map(async item => {
          const book = await Book.findById(item.bookId);
          if (!book) {
            throw new Error(`Book with id ${item.bookId} not found`);
          }
          if (item.quantity <= 0){
            throw new Error("Quantity > 0")
          }
          if(book.quantity < item.quantity ){
            throw new Error("Out of stock")
          }
          return await OrderDetail.create({
            orderId: order._id,
            bookId: book._id,
            quantity: item.quantity,
            price: book.price
          });
        }
      )
    );
  }
  const populatedOrders = await Order.findById(order._id)
    .populate('customerId', 'fullName email')
    .lean();
  populatedOrders.details = await OrderDetail.find({ orderId: order._id });
  return populatedOrders;
}

export async function updateOrderService(orderId, customerId, paymentMethod, purchaseStatus, purchaseDate, details) {
  const order = await Order.findByIdAndUpdate(
    orderId,
    {
      customerId: customerId,
      paymentMethod: paymentMethod,
      purchaseStatus: purchaseStatus,
      purchaseDate: purchaseDate
    },
    { new: true }
  );
  if (!order) {
    throw new Error(`Order with id ${orderId} not found`);
  }
  if(Array.isArray(details)) {
    await OrderDetail.deleteMany({ orderId: order._id });
    // xu ly quantity theo paymentStatus ==> co ham duoi sua roi luoi vai l
    if (details.length > 0) {
      const newDetails = []
      for (const item of details) {
        const book = await Book.findById(item.bookId);
        if (!book) {
          throw new Error(`Book with id ${item.bookId} not found`);
        }
        newDetails.push({
          orderId: order._id,
          bookId: book._id,
          quantity: item.quantity,
          price: book.price
        })
      }
      await OrderDetail.insertMany(newDetails);
    }
  }
  const populatedOrders = await Order.findById(order._id)
    .populate('customerId', 'fullName email')
    .lean();
  populatedOrders.details = await OrderDetail.find({ orderId: order._id });
  return populatedOrders;
}

export async function getAllOrdersByCustomerId(customerId) {
  const populatedOrders = await Order.find({ customerId: customerId })
    .populate('customerId', 'fullName email')
    .lean();
  populatedOrders.details = await OrderDetail.find({ orderId: populatedOrders._id });
  return populatedOrders;
}

export async function deleteOrderService(orderId, customerId) {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error(`Order with id ${orderId} not found`);
  }
  if (order.customerId.toString() === customerId.toString()) {
    throw new Error(`You are not authorize to delete this order`);
  }
  await OrderDetail.deleteMany({ orderId: order._id });
  await Order.findByIdAndDelete(order._id);
  return order;
}

export async function getOrderByIdService(orderId) {
  const order = await Order.findById(orderId)
    .populate('customerId', 'fullName email')
    .lean()
  if (!order){
    throw new Error(`Order with id ${orderId} not found`);
  }
  order.details = await OrderDetail.find({ orderId: order._id });
  return order;
}

export async function updatePurchaseStatusService(orderId,customerId, purchaseStatus) {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error(`Order with id ${orderId} not found`);
  }
  if (order.customerId.toString() !== customerId.toString()) {
    throw new Error(`You are not authorize to delete this order`);
  }
  if (order.purchaseStatus.toString() === "pending" && purchaseStatus.toString() === "processing"){
    const orderDetail = await OrderDetail.find({orderId: order._id});
    if (orderDetail.length === 0){
      throw new Error(`Order details not found`);
    }
    for (const item of orderDetail) {
      const book = await Book.findById(item.bookId);
      book.quantity -= item.quantity
      await book.save()
    }
  }
  if (order.purchaseStatus.toString() === "processing" && purchaseStatus.toString() === "canceled"){
    const orderDetail = await OrderDetail.find({orderId: order._id});
    if(orderDetail.length === 0){
      throw new Error(`Order details not found`);
    }
    for (const item of orderDetail) {
      const book = await Book.findById(item.bookId);
      book.quantity += item.quantity
      await book.save()
    }
  }
  order.purchaseStatus = purchaseStatus;
  await order.save();
  return order;
}
export async function getOrderByStatusAndCustomerId(customerId, purchaseStatus) {
  const order = await Order.find({customerId: customerId, purchaseStatus: purchaseStatus})
    .populate('customerId', 'fullName email')
    .lean();
  order.details = await OrderDetail.find({ orderId: order._id });
  return order;
}