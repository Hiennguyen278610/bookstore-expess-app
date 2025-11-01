import { loginUser, registerUser } from '../controllers/UserController.js';
import passport from '../config/passport.js';
import { generateToken } from '../utils/jwt.js';
import { toUserResponse } from '../mappers/UserMapper.js';
import express from 'express';
import dotenv from 'dotenv';
import { checkEmptyBody } from '../middlewares/checkEmptyBody.js';
dotenv.config();

const router = express.Router();

router.post('/register',checkEmptyBody, registerUser);

router.post('/login',checkEmptyBody, loginUser);

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