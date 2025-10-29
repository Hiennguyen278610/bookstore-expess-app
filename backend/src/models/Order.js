import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  purchaseDate: {type: Date, default: Date.now},
  purchaseStatus: {type: String, enum: ['pending', 'processing', 'completed', 'canceled'], default: 'pending'},
  paymentMethod: {type: String, enum: ['cash', 'creditCard'], default: 'cash'},
}, { timestamps: true });

orderSchema.virtual("details", {
  ref: "OrderDetail",
  localField: "_id",
  foreignField: "orderId"
})
orderSchema.set("toObject", { virtuals: true });
orderSchema.set("toJSON", { virtuals: true });
export default mongoose.model("Order", orderSchema);