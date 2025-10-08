import mongoose from 'mongoose';
import { uuidv4 } from 'zod';

const userSchema = new mongoose.Schema({
  fullName: { type: String},
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, unique: true },
  password: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('User', userSchema);