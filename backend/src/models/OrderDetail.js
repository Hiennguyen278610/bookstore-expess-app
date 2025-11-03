import mongoose from "mongoose";
import Order from './Order.js';
import order from './Order.js';

const orderDetailSchema = new mongoose.Schema({
  orderId: {type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true},
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  price: {type: Number, default: 0},
  quantity: {type: Number, default: 0},
}, { timestamps: true });

async function updateOrderTotal(orderId) {
  const OrderDetail = mongoose.model("OrderDetail");
  const details = await OrderDetail.find({ orderId });
  const total = details.reduce((sum, d) => sum + d.quantity*d.price, 0);
  await Order.findByIdAndUpdate(orderId, { totalAmount: total });
}
orderDetailSchema.post("save", async function () { await updateOrderTotal(this.orderId); });
orderDetailSchema.post("deleteMany", async function (){
  const orderId = this.getFilter().orderId;
  if (orderId) await updateOrderTotal(orderId);
})

export default mongoose.model("OrderDetail", orderDetailSchema);