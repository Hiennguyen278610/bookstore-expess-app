import express from 'express';
import { createBook, deleteBook, findBook, updateBook } from '../controllers/BookController.js';
import { auth } from '../middlewares/auth.js';
import { authorizeRoles } from '../middlewares/authorize.js';
import { uploadImage } from '../middlewares/uploadImage.js';

const router = express.Router();

router.post("/",auth, authorizeRoles("admin"),uploadImage.array("images", 10), createBook);
router.put("/:id",auth, authorizeRoles("admin"),uploadImage.array("images", 10), updateBook);
router.get("/:id", findBook);
router.delete("/:id",auth, authorizeRoles("admin"), deleteBook);

export default router;