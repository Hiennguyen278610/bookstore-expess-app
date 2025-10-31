import mongoose from 'mongoose';
import Category from './Category.js';
const bookSchema = new mongoose.Schema({
  name: { type: String, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  publisherId: {type: mongoose.Schema.Types.ObjectId, ref: 'Publisher', required: true },
  imageUrl: [{ type: String }],
  quantity: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  isDeleted: { type: Boolean, default: false}
}, { timestamps: true });

bookSchema.virtual("authors", {
  ref: "BookAuthor",
  localField: "_id",
  foreignField: "bookId",
})
bookSchema.set("toJSON", { virtuals: true });
bookSchema.set("toObject", { virtuals: true });
export default mongoose.model('Book', bookSchema);