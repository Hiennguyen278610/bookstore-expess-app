import {
  changePasswordService,
  forgotPasswordService, getProfileService, googleLoginService,
  loginService,
  registerService, resendVerificationService,
  resetPasswordService, updateProfileService,
  verifyEmailService
} from '../services/AuthService.js';
import User from '../models/User.js';
import { ErrorResponse } from '../utils/error.js';

export const getAll = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  }
  catch(err) {
    res.status(500).json({ message: err.message });
  }
};

export const getById = (req, res) => {
    res.status(200).send("Nhân viên 1");
};
export const registerUser = async (req, res, next) => {
  try {
    const result = await registerService(req.body);
    res.status(201).json({
      success: true,
      message: 'Register successful',
      data: result
    });
  } catch (err) {
    if (err instanceof ErrorResponse) {
      res.status(err.statusCode || 400).json({
        success: false,
        code: err.code,
        errors: err.errors
      });
      return;
    }
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const result = await loginService(username, password);
    console.log('User logged in:', result.UserResponse);
    res.json({
      success: true,
      message: 'Login successful',
      data: result
    });
  } catch (err) {
    if (err instanceof ErrorResponse) {
      res.status(err.statusCode || 401).json({
        success: false,
        code: err.code,
        message: err.message
      });
      return;
    }
    next(err)
  }
};
export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query; //lum token tren params nhe
    const result = await verifyEmailService(token);
    res.json({
      success: true,
      message: 'Email verified successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};
//gui link den email neu email ton tai
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    await forgotPasswordService(email);
    res.json({
      success: true,
      message: 'If the email exists, password reset instructions have been sent'
    });
  } catch (error) {
    next(error);
  }
};
// email chuyen token len fe xxong goi cai nay de doi mat khau
export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    await resetPasswordService(token, newPassword);
    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    next(error);
  }
};
// gui lai email 1p/lan
export const resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    await resendVerificationService(email);
    res.json({
      success: true,
      message: 'Verification email resent successfully'
    });
  } catch (error) {
    next(error);
  }
};
//doi mat khau khi da login roi
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await changePasswordService(req.user.id, currentPassword, newPassword);
    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
};
//lum profile  len
export const getProfile = async (req, res, next) => {
  try {
    const result = await getProfileService(req.user.username);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
//cap nhat user
export const updateProfile = async (req, res, next) => {
  try {
    const result = await updateProfileService(req.user.id, req.body);
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};
//login google
export const googleLogin = async (req, res, next) => {
  try {
    const {code} = req.body;
    const result = await googleLoginService(code);
    res.json({
      success: true,
      message: 'Login successful',
      data: result
    });
  }catch (error){
    next(error);
  }
}