import {
  changePassword,
  forgotPassword,
  getProfile,
  googleLogin,
  loginUser,
  registerUser,
  resendVerification,
  resetPassword,
  updateProfile,
  verifyEmail
} from '../controllers/AuthController.js';
import express from 'express';
import { checkEmptyBody } from '../middlewares/checkEmptyBody.js';
import { auth } from '../middlewares/auth.js';


const router = express.Router();

router.post('/register',checkEmptyBody, registerUser);
router.post('/login',checkEmptyBody, loginUser);
router.post('/google', googleLogin);
router.get('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/resend-verification', resendVerification);

router.post('/change-password', auth, changePassword);
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);


export default router;