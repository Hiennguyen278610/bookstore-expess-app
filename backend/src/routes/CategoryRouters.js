import express from 'express';
import { createCategory, deleteCategory, getAllCategories, getCategoryById, getCategoryBySlug, updateCategory } from '../controllers/CategoryController.js';
import { auth } from '../middlewares/auth.js';
import { authorizeRoles } from '../middlewares/authorize.js';
import { checkEmptyBody } from '../middlewares/checkEmptyBody.js';

const router = express.Router();

router.get("/", getAllCategories);
router.get("/:slug", getCategoryBySlug)
router.use(auth)
router.use(checkEmptyBody)

router.post("/",authorizeRoles("admin"), createCategory);
router.put("/:id",authorizeRoles("admin"), updateCategory);
router.delete("/:id",authorizeRoles("admin"), deleteCategory);

router.get("/:id", getCategoryById);

export default router;