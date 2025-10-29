import mongoose from "mongoose";

const orderDetailSchema = new mongoose.Schema({
  orderId: {type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true},
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  price: {type: Number, default: 0},
  quantity: {type: Number, default: 0},
}, { timestamps: true });
export default mongoose.model("OrderDetail", orderDetailSchema);