import mongoose from "mongoose";

const supplyDetailSchema = new mongoose.Schema({
  receiptId: {type: mongoose.Schema.Types.ObjectId, ref: 'SupplierReceipt', required: true},
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  importPrice: {type: Number, default: 0},
  quantity: {type: Number, min: 1},
}, { timestamps: true });
export default mongoose.model("SupplyDetail", supplyDetailSchema);
