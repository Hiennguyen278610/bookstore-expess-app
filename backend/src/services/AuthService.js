import User from '../models/User.js';
import { comparePassword, hashPassword } from '../helper/hashPassword.js';
import { generateToken } from '../utils/jwt.js';
import { ErrorResponse } from '../utils/error.js';
import { toUserResponse } from '../mappers/UserMapper.js';
export const registerService = async (userData) => {
  const existing = await User.findOne({
    $or: [{ username: userData.username }, { email: userData.email }, { phone: userData.phone }]
  });
  if (existing) {
    throw new ErrorResponse('User already exists', 400);
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
    throw new ErrorResponse('Invalid username or password', 401);
  }
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new ErrorResponse('Invalid username or password', 401);
  }
  const UserResponse = toUserResponse(user);
  const token = generateToken(UserResponse);
  return { UserResponse, token };
};