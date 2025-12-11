// Auth Middleware - Xác minh JWT token

import { verifyToken } from '../utils/jwt.js';
import User from '../models/User.js';

// Middleware xác thực token (cho tất cả protected routes)
export const authenticate = async (req, res, next) => {
    console.log('authenticate middleware called, req.headers.authorization:', req.headers.authorization);
    try {
        // Lấy token từ header Authorization: "Bearer <token>"
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'Truy cập bị từ chối. Không có token.' });
        }

        // Xác minh token
        const decoded = verifyToken(token);
        console.log('Decoded token:', decoded);

        // Tìm user trong DB
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ error: 'Token không hợp lệ.' });
        }

        // Gắn user vào req để dùng trong controller
        req.user = user;
        console.log('req.user set:', req.user);
        next(); // Tiếp tục
    } catch (error) {
        console.error('Error in authenticate:', error);
        res.status(401).json({ error: 'Token không hợp lệ.' });
    }
};

// Middleware kiểm tra quyền admin
export const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Truy cập bị từ chối. Cần quyền admin.' });
    }
    next();
};
