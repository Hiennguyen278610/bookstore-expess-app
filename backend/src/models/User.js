import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: { type: String},
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, unique: true, sparse: true },
  password: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isVerified: { type: Boolean, default: false },
  lastVerificationSent: Date,
  lastPasswordResetSent: Date,
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('User', userSchema);