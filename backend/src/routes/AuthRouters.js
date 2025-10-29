import { loginUser, registerUser } from '../controllers/UserController.js';
import passport from '../config/passport.js';
import { generateToken } from '../utils/jwt.js';
import { toUserResponse } from '../mappers/UserMapper.js';
import express from 'express';

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

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