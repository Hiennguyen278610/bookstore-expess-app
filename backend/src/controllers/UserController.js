// UserController - Xử lý HTTP requests cho users

import { userService } from '../services/UserService.js';

// Đăng ký user
export const registerUser = async (req, res) => {
    try {
        const result = await userService.registerUser(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Đăng nhập
export const loginUser = async (req, res) => {
    console.log('loginUser controller called, req.body:', req.body);
    try {
        const result = await userService.loginUser(req.body);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error in loginUser controller:', error);
        res.status(401).json({ error: error.message });
    }
};

// Lấy tất cả users (admin)
export const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Lấy user theo ID
export const getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

// Cập nhật user
export const updateUserProfile = async (req, res) => {
    console.log('updateUserProfile controller called, req.params.id:', req.params.id, 'req.body:', req.body, 'req.user:', req.user);
    try {
        const result = await userService.updateUserProfile(req.params.id, req.body);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error in updateUserProfile controller:', error);
        res.status(400).json({ error: error.message });
    }
};

// Xóa user
export const deleteUser = async (req, res) => {
    try {
        const result = await userService.deleteUser(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Lấy profile của user hiện tại (từ token)
export const getUserProfile = async (req, res) => {
    try {
        const user = await userService.getUserProfile(req.user.id); // req.user từ middleware
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};
