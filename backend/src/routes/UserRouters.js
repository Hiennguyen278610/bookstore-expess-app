import express from 'express';
import { auth } from '../middlewares/auth.js';
import { authorizeRoles } from '../middlewares/authorize.js';
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from '../controllers/UserController.js';

const router = express.Router();
//comment lai con test api lam xongg thi xoa di nhe' from manh dung
//router.use(auth)
//router.use(authorizeRoles("admin"))


router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser)
router.post("/", createUser)
router.delete("/:id", deleteUser)


export default router;