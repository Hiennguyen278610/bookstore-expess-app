import User from '../models/User.js';
import {
  createOrderService,
  deleteOrderService,
  getAllOrdersByCustomerId, getOrderByIdService, getOrderByStatusAndCustomerId,
  updateOrderService, updatePurchaseStatusService
} from '../services/OrderService.js';
import Order from '../models/Order.js';
import data from 'passport-oauth2/lib/errors/tokenerror.js';
import order from '../models/Order.js';

export async function createOrder(req, res) {
  try {
    const dataUser = req.user;
    const user = await User.findOne({ username: dataUser.username });
    const {details, paymentMethod} = req.body;
    const order = await createOrderService(user._id, paymentMethod, details);
    if (!order) {
      return res.status(400).send({message: 'Error creating Order'});
    }
    return res.status(200).json(order);
  }catch (err){
    res.status(400).send({message: err.message});
  }
}
export async function getAllOrders(req, res) {
  try {
    const dataUser = req.user;
    const user = await User.findOne({ username: dataUser.username });
    const order = await getAllOrdersByCustomerId(user._id);
    if (!order) {
      return res.status(400).send({message: 'Error getting all orders'});
    }
    return res.status(200).json(order);
  }catch (err){
    res.status(400).send({message: err.message});
  }
}
export async function updateOrder(req, res) {
  try {
    const dataUser = req.user;
    const user = await User.findOne({ username: dataUser.username });
    const {paymentMethod,paymentStatus, paymentDate, details} = req.body;
    const order = await updateOrderService(req.params.id, user._id, paymentMethod,paymentStatus, paymentDate, details);
    console.log(order);
    if (!order) {
      return res.status(400).send({message: 'Error updating order'});
    }
    return res.status(200).json(order);
  }catch (err){
    res.status(400).send({message: err.message});
  }
}
export async function deleteOrder(req, res) {
  try {
    const dataUser = req.user;
    const user = await User.findOne({ username: dataUser.username });
    const order = await deleteOrderService(req.params.id, user._id);
    if (!order) {
      return res.status(400).send({message: 'Error deleting order'});
    }
    return res.status(200).json(order);
  }catch (err){
    res.status(400).send({message: err.message});
  }
}
export async function getOrderById(req, res) {
  try {
    const order = getOrderByIdService(req.params.id);
    if (!order) {
      return res.status(400).send({message: 'Error deleting order'});
    }
    return res.status(200).json(order);
  }catch (err){
    res.status(400).send({message: err.message});
  }
}
export async function updateStatus(req, res) {
  try {
    const dataUser = req.user;
    const user = await User.findOne({ username: dataUser.username });
    const {purchaseStatus} = req.body;
    const order = await updatePurchaseStatusService(req.params.id, user._id, purchaseStatus);
    if (!order) {
      return res.status(400).send({message: 'Update Purchase Status Failed'});
    }
    return res.status(200).json(order);
  }catch (err){
    res.status(400).send({message: err.message});
  }
}
export async function getOrdersByStatus(req, res) {
  try {
    const dataUser = req.user;
    const user = await User.findOne({ username: dataUser.username });
    const {purchaseStatus} = req.body;
    const order = await getOrderByStatusAndCustomerId(user._id, purchaseStatus);
    if (!order) {
      return res.status(400).send({message: 'Get Order By Status Failed'});
    }
    return res.status(200).json(order);
  }catch (err){
    res.status(400).send({message: err.message});
  }
}
//[ lum cai id xong tim order xem cai status do co dang delivery khong thi khong cho cancel
// export async function cancelOrder(req, res) {
//   try {
//     const dataUser = req.user;
//     const user = await User.findOne({ username: dataUser.username });
//     const {purchaseStatus} = req.body;
//     if (purchaseStatus.toString() === "delivery") {
//       return res.status(400).send({message: 'Cannot cancel Order, Delivering'});
//     }
//     const order = await updatePurchaseStatusService(req.params.id, user._id, purchaseStatus);
//     if (!order) {
//       return res.status(400).send({message: 'Update Purchase Status Failed'});
//     }
//     return res.status(200).json(order);
//   }catch (err){
//     res.status(400).send({message: err.message});
//   }
// }
