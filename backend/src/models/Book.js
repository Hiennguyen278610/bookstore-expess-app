import mongoose from 'mongoose';
import Category from './Category.js';
const bookSchema = new mongoose.Schema({
  name: { type: String, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  frontImage: { type: String },
  quantity: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  isDeleted: { type: Boolean, default: false}
}, { timestamps: true });

export default mongoose.model('Book', bookSchema);