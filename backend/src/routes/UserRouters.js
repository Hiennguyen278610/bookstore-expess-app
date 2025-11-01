import express from "express";
import { getAll, getById } from '../controllers/UserController.js';
import { auth } from '../middlewares/auth.js';
import { authorizeRoles } from '../middlewares/authorize.js';

const router = express.Router();

router.get("/",  getAll);
// auth, authorizeRoles("admin"),
router.get("/me", auth, async(req, res) => {
  res.status(200).json(req.user);
})
router.get("/:id", getById);


export default router;