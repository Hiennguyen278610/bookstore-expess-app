import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  purchaseDate: {type: Date, default: Date.now},
  purchaseStatus: {type: String, enum: ['pending', 'processing','delivery', 'completed', 'canceled'], default: 'pending'},
  paymentMethod: {type: String, enum: ['cash', 'creditCard', 'payos'], default: 'cash'},
  paymentStatus: {type: String, enum: ['unpaid', 'paid', 'failed', 'refunded'], default: 'unpaid'},
  totalAmount: {type: Number},
  paymentLink: {type: String},
  paymentLinkId: {type: String},
  payosOrderId: {type: Number},
}, { timestamps: true });

orderSchema.virtual("details", {
  ref: "OrderDetail",
  localField: "_id",
  foreignField: "orderId"
})
orderSchema.set("toObject", { virtuals: true });
orderSchema.set("toJSON", { virtuals: true });
export default mongoose.model("Order", orderSchema);