import express from 'express';
import { createCategory, deleteCategory, getCategoryById, updateCategory } from '../controllers/CategoryController.js';

const router = express.Router();

router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);
router.get("/:id", getCategoryById);

export default router;