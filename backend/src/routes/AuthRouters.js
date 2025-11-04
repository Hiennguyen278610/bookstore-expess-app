import {
  changePassword,
  forgotPassword,
  getProfile,
  loginUser,
  registerUser,
  resendVerification,
  resetPassword,
  updateProfile,
  verifyEmail
} from '../controllers/AuthController.js';
import passport from '../config/passport.js';
import { generateToken } from '../utils/jwt.js';
import { toUserResponse } from '../mappers/UserMapper.js';
import express from 'express';
import dotenv from 'dotenv';
import { checkEmptyBody } from '../middlewares/checkEmptyBody.js';
import { auth } from '../middlewares/auth.js';

dotenv.config();

const router = express.Router();

router.post('/register',checkEmptyBody, registerUser);
router.post('/login',checkEmptyBody, loginUser);
router.get('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/resend-verification', resendVerification);

router.post('/change-password', auth, changePassword);
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

router.post('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.post('/github', passport.authenticate('github', { scope: ['user:email'] }));


router.get('/callback/google',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    console.log('req.user: ', req.user);
    const token = generateToken(toUserResponse(req.user));
    res.json({ UserResponse: toUserResponse(req.user), token });
  });
router.get('/callback/github', passport.authenticate('github', { session: false }),
  (req, res) => {
    console.log('req.user: ', req.user);
    const token = generateToken(toUserResponse(req.user));
    res.json({ UserResponse: toUserResponse(req.user), token });
  });


export default router;