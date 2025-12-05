import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  type: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
}, {timestamps: true})

export default mongoose.model('Address', addressSchema);