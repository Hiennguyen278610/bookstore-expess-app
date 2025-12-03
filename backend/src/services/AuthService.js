import User from '../models/User.js';
import { comparePassword, hashPassword } from '../helper/hashPassword.js';
import {
  generateEmailVerificationToken,
  generatePasswordResetToken,
  generateToken,
  verifyEmailToken,
  verifyPasswordResetToken
} from '../utils/jwt.js';
import { ErrorResponse } from '../utils/error.js';
import { toUserResponse } from '../mappers/UserMapper.js';
import { sendPasswordResetEmail, sendPasswordResetSuccessEmail, sendVerificationEmail } from './mail.service.js';
import { client } from '../config/clientgoogle.config.js';
import { v4 as uuidv4 } from 'uuid';

export const registerService = async (userData) => {
  const existing = await User.find({
    $or: [
      { username: userData.username },
      { email: userData.email },
      { phone: userData.phone }
    ]
  });
  if (existing) {
    const errors = [];
    existing.forEach(user => {
      if (user.username === userData.username)
        errors.push({ field: "username", code: "USERNAME_EXISTS", message: "Tài khoản đã tồn tại" });
      if (user.email === userData.email.toLowerCase())
        errors.push({ field: "email", code: "EMAIL_EXISTS", message: "Email đã tồn tại" });
      if (user.phone === userData.phone)
        errors.push({ field: "phone", code: "PHONE_EXISTS", message: "Số điện thoại đã tồn tại" });
    });

    if (errors.length > 0) {
      throw new ErrorResponse("Validation failed", 400, undefined, errors);
    }
  }

  const user = new User(userData);
  user.password = await hashPassword(userData.password);
  await user.save();

  const UserResponse = toUserResponse(user);
  const token = generateToken(UserResponse);
  return { UserResponse, token };
};

export const loginService = async (username, password) => {
  const user = await User.findOne({
    $or: [{ username: username }, { email: username }, { phone: username}]
  });
  if (!user) {
    throw new ErrorResponse('Tài khoản không tồn tại', 401, 'USER_NOT_FOUND');
  }
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new ErrorResponse('Mật khẩu không đúng', 401, 'INVALID_PASSWORD');
  }
  const UserResponse = toUserResponse(user);
  const token = generateToken(UserResponse);
  return { UserResponse, token };
};
export const verifyEmailService = async (token) => {
  const decoded = verifyEmailToken(token)
  if (!decoded) {
    throw new ErrorResponse('Invalid token', 401);
  }
  const user = await User.findById(decoded.userId);
  if (!user){
    throw new ErrorResponse('User not found', 404);
  }
  if (user.email !== decoded.email){
    throw new ErrorResponse('Token email mismatch', 401);
  }
  if (user.isVerified){
    throw new ErrorResponse('Email already verified', 400);
  }
  user.isVerified = true;
  await user.save();
  const UserResponse = toUserResponse(user);
  const authToken = generateToken(UserResponse);
  return { UserResponse , token: authToken };
};

export const forgotPasswordService = async (email) => {
  const user = await User.findOne({ email: email });
  if(!user){
    return {  success: true } // luôn trả true để tăng bảo mật tránh cho hacker biết email có tồn tại k
  }
  const now = new Date()
  const lastSent = user.lastPasswordResetSent;
  if (lastSent && now - lastSent < 60 * 1000) { // 1p
    throw new ErrorResponse('Please wait 1 minute before requesting another password reset', 429);
  }
  const resetToken = generatePasswordResetToken(user)
  user.lastPasswordResetSent = now
  await user.save();
  await sendPasswordResetEmail(user, resetToken) //fe xem them trong mail template co href chuyen huong
  return { success: true };
}
export const resetPasswordService = async (token, newPassword) => {
  const decoded = verifyPasswordResetToken(token)
  if (!decoded) {
    throw new ErrorResponse('Invalid token', 401);
  }
  const user = await User.findById(decoded.userId);
  if (!user){
    throw new ErrorResponse('User not found', 404);
  }
  if (user.email !== decoded.email){
    throw new ErrorResponse('Token email mismatch', 401);
  }
  user.password = await hashPassword(newPassword);
  await user.save();
  await sendPasswordResetSuccessEmail(user)
  return {  success: true}
}
export const resendVerificationService = async (email) => {
  const user = await User.findOne({ email: email });
  if (!user){
    throw new ErrorResponse('User not found', 404);
  }
  if (user.isVerified){
    throw new ErrorResponse('Email already verified', 400);
  }
  const now = new Date()
  const lastSent = user.lastVerificationSent;
  if (lastSent && now - lastSent < 60 * 1000){ // 1 phut
    throw new ErrorResponse('Please wait 1 minute before requesting another verification email', 429);
  }
  const verificationToken = generateEmailVerificationToken(user)
  user.lastVerificationSent = now
  await user.save();
  await sendVerificationEmail(user, verificationToken)
  return { success: true };
}
//change password after login
export const changePasswordService = async (userId, oldPassword, newPassword) => {
  const user = await User.findById(userId);
  if (!user){
    throw new ErrorResponse('User not found', 404);
  }
  const isMatch = await comparePassword(oldPassword, user.password);
  if (!isMatch) {
    throw new ErrorResponse('Current password is incorrect', 401);
  }
  user.password = await hashPassword(newPassword);
  await user.save();
  return {  success: true}
}
export const getProfileService = async (username) => {
  const user = await User.findOne({username: username});
  if (!user) {
    throw new ErrorResponse('User not found', 404);
  }
  return { fullName: user.fullName, email: user.email, phone: user.phone };
};
export const updateProfileService = async (userId, updateData) => {
  const user = await User.findById(userId)
  if (!user){
    throw new ErrorResponse('User not found', 404);
  }
  // check email/username/phone có tồn tại trong thằng user khác không
  if (updateData.email && updateData.email !== user.email){
    const existingEmail = await User.findOne({
      email: updateData.email,
      _id: { $ne: userId } //not equal
    })
    if (existingEmail) {
      throw new ErrorResponse('Email already exists', 400);
    }
  }
  if (updateData.username && updateData.username !== user.username){
    const existingUsername = await User.findOne({
      username: updateData.username,
      _id: { $ne: userId } //not equal
    })
    if (existingUsername) {
      throw new ErrorResponse('Username already exists', )
    }
  }
  if (updateData.phone && updateData.phone !== user.phone){
    const existingPhone = await User.findOne({
      phone: updateData.phone,
      _id: { $ne: userId } //not equal
    })
  }
  // Cập nhật thông tin
  Object.keys(updateData).forEach(key => {
    if (updateData[key] !== undefined) {
      user[key] = updateData[key]; //Ex: user.customerId = updateData.customerId
    }
  });
  await user.save();
  const UserResponse = toUserResponse(user);
  return { UserResponse };
}

export const googleLoginService = async (code) => {
  const { tokens } = await client.getToken(code);
  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: process.env.GOOGLE_CLIENT_ID
  });
  const payload = await ticket.getPayload();
  let user = await User.findOne({ email: payload.email });
  const username = await uuidv4();
  const password = await hashPassword(uuidv4());
  if (!user) {
    user = new User({
      fullName: payload.name,
      username: username,
      email: payload.email,
      isVerified: payload.email_verified,
      phone: null,
      password: password
    });
    await user.save();
  }
  const UserResponse = toUserResponse(user);
  const token = generateToken(toUserResponse(user));
  return { UserResponse, token };
};