import express from 'express';
import { createBook, deleteBook, findBook, getBooks, getMaxPrice, updateBook } from '../controllers/BookController.js';
import { auth } from '../middlewares/auth.js';
import { authorizeRoles } from '../middlewares/authorize.js';
import { uploadImage } from '../middlewares/uploadImage.js';
import { checkEmptyBody } from '../middlewares/checkEmptyBody.js';

const router = express.Router();

router.get("/max-price", getMaxPrice)

router.post("/",auth, authorizeRoles("admin"),uploadImage.array("images", 10), checkEmptyBody, createBook);
router.put("/:id",auth, authorizeRoles("admin"),uploadImage.array("images", 10), checkEmptyBody, updateBook);
router.delete("/:id", auth, authorizeRoles("admin"), deleteBook);

router.get("/:id", findBook);
router.get("/", getBooks)

export default router;