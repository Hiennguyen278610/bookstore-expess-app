import mongoose from 'mongoose';

const bookAuthorSchema = new mongoose.Schema({
  bookId: {type: mongoose.Types.ObjectId, ref: 'Book', required: true},
  authorId: {type: mongoose.Types.ObjectId, ref: 'Author', required: true},
  isDeleted: { type: Boolean, default: false }
}, { timestamps: false });

export default mongoose.model('BookAuthor', bookAuthorSchema);