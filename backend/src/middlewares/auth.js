import User from '../models/User.js';
import { verifyToken } from '../utils/jwt.js';
import { toUserResponse } from '../mappers/UserMapper.js';
export async function auth(req, res, next){
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Missing token' });
  }
  try {
    const data = verifyToken(token);
    const user = await User.findOne({ username: data.username });
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    req.user = toUserResponse(user);
    next();
  } catch (err) {
    res.status(401).json({ message: 'Not authorized to access this resource' });
  }
}