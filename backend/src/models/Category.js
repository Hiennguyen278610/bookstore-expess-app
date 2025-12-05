import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug : {type: String, required: true, unique: true},
  isDeleted: { type: Boolean, default: false }
}, { timestamps: false });

export default mongoose.model('Category', categorySchema);