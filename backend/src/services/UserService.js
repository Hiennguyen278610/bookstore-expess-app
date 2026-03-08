// UserService - Logic nghiệp vụ cho user (CRUD và auth)

import User from '../models/User.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt.js';

export const userService = {
    // 1. Đăng ký user (Create)
    async registerUser(userData) {
        const { username, email, password, role = 'customer' } = userData;

        // Kiểm tra user đã tồn tại
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            throw new Error('Username hoặc email đã tồn tại');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo user mới
        const newUser = new User({
            username,
            hashpassword: hashedPassword,
            email,
            role
        });

        await newUser.save();
        return { message: 'Đăng ký thành công', user: newUser };
    },

    // 2. Đăng nhập (Auth)
    async loginUser(credentials) {
        console.log('loginUser service called with credentials:', credentials);
        const { username, password } = credentials;

        // Tìm user
        const user = await User.findOne({ username });
        console.log('User found:', user ? { id: user._id, username: user.username, role: user.role } : null);
        if (!user) {
            throw new Error('Sai username hoặc password');
        }

        // Kiểm tra password
        const isValid = await bcrypt.compare(password, user.hashpassword);
        console.log('Password comparison result:', isValid);
        if (!isValid) {
            throw new Error('Sai username hoặc password');
        }

        // Tạo token
        const token = generateToken({ id: user._id, username: user.username, role: user.role });
        console.log('Token generated successfully');
        return { message: 'Đăng nhập thành công', token, user: { id: user._id, username, email: user.email, role: user.role } };
    },

    // 3. Lấy tất cả users (Read - admin)
    async getAllUsers() {
        const users = await User.find().select('-hashpassword'); // Ẩn password
        return users;
    },

    // 4. Lấy user theo ID (Read)
    async getUserById(userId) {
        const user = await User.findById(userId).select('-hashpassword');
        if (!user) {
            throw new Error('User không tồn tại');
        }
        return user;
    },

    // 5. Cập nhật user (Update)
    async updateUserProfile(userId, updateData) {
        const { username, email, password, role } = updateData;
        const updateFields = {};

        if (username) updateFields.username = username;
        if (email) updateFields.email = email;
        if (role) updateFields.role = role;
        if (password) {
            updateFields.hashpassword = await bcrypt.hash(password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true }).select('-hashpassword');
        if (!updatedUser) {
            throw new Error('User không tồn tại');
        }
        return { message: 'Cập nhật thành công', user: updatedUser };
    },

    // 6. Xóa user (Delete)
    async deleteUser(userId) {
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            throw new Error('User không tồn tại');
        }
        return { message: 'Xóa user thành công' };
    },

    // 7. Lấy profile (giống getUserById, cho current user)
    async getUserProfile(userId) {
        return this.getUserById(userId);
    }
};