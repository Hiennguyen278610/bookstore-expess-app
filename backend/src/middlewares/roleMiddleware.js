
import User from '../models/User.js';

// Middleware kiểm tra quyền admin
export const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Truy cập bị từ chối. Cần quyền admin.' });
    }
    next();
};