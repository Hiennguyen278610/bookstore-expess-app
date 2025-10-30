import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  phone: {type: String, required: true, sparse: true },
  email: {type: String, required: true, sparse: true},
  address: {type: String, required: true, sparse: true},
}, { timestamps: false });

export default mongoose.model('Supplier', supplierSchema);