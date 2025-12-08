import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  detail: { type: String },
  province: { type: String, required: true },
  district: { type: String, required: true },
  addressType: { type: String,enum: ['Nhà riêng', 'Phòng trọ', 'Văn phòng', 'Khác'], default: 'Nhà riêng' },
  isDefault: { type: Boolean, default: false },
}, {timestamps: true})

export default mongoose.model('Address', addressSchema);