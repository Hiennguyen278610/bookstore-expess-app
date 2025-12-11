// UserRoutes - Định nghĩa endpoints API cho users

import express from 'express';
import {
    registerUser,
    loginUser,
    getAllUsers,
    getUserById,
    updateUserProfile,
    deleteUser,
    getUserProfile
} from '../controllers/UserController.js';
import { authenticate, authorizeAdmin } from '../middlewares/auth.js';

const router = express.Router();

// Routes công khai (không cần auth)
router.post('/register', registerUser);  // Đăng ký
router.post('/login', loginUser);        // Đăng nhập

// Routes bảo vệ (cần auth)
router.get('/profile', authenticate, getUserProfile);        // Lấy profile của user hiện tại
router.get('/', authenticate, authorizeAdmin, getAllUsers);  // Lấy tất cả users (admin)
router.get('/:id', authenticate, getUserById);               // Lấy user theo ID
router.put('/:id', authenticate, updateUserProfile);         // Cập nhật user
router.delete('/:id', authenticate, authorizeAdmin, deleteUser); // Xóa user (admin)

export default router;
