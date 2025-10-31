import mongoose from "mongoose";

const supplierReceiptSchema = new mongoose.Schema({
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  supplyDate: {type: Date, default: Date.now},
  purchaseStatus: {type: String, enum: ['pending', 'processing','delivery', 'completed', 'canceled'], default: 'pending'}
}, { timestamps: true });

supplierReceiptSchema.virtual("details", {
  ref: "SupplyDetail",
  localField: "_id",
  foreignField: "receiptId"
})
supplierReceiptSchema.set("toObject", { virtuals: true });
supplierReceiptSchema.set("toJSON", { virtuals: true });
export default mongoose.model("SupplierReceipt", supplierReceiptSchema);