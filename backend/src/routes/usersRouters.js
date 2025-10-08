import express from "express";
import { getAll, getById, loginUser, registerUser } from '../controllers/userController.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();

router.get("/", getAll);

router.get("/1", getById);

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/me", auth, async(req, res) => {
  res.status(200).json(req.user);
})
export default router;