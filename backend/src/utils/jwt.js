// JWT Utilities - Tạo và xác minh token JWT

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Khóa bí mật (nên lấy từ .env)
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key-change-this';

// Hàm tạo token
export const generateToken = (payload) => {
    // Payload có thể là { id: user._id, username, role }
    return jwt.sign(payload, SECRET_KEY,
        { expiresIn: '1h' }
    ); // Hết hạn sau 1 giờ
};

// Hàm xác minh token
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, SECRET_KEY); // Trả về payload nếu hợp lệ
    } catch (error) {
        throw new Error('Token không hợp lệ hoặc đã hết hạn');
    }
};