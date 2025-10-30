import mongoose from 'mongoose';

const authorSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: false });

export default mongoose.model('Author', authorSchema);