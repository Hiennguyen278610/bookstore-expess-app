import express from 'express';
import { createCategory, deleteCategory, getCategoryById, updateCategory } from '../controllers/CategoryController.js';
import { auth } from '../middlewares/auth.js';
import { authorizeRoles } from '../middlewares/authorize.js';

const router = express.Router();

router.use(auth)

router.post("/",authorizeRoles("admin"), createCategory);
router.put("/:id",authorizeRoles("admin"), updateCategory);
router.delete("/:id",authorizeRoles("admin"), deleteCategory);
router.get("/:id", getCategoryById);

export default router;