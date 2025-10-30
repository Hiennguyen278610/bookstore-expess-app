import express from 'express';
import { auth } from '../middlewares/auth.js';
import { authorizeRoles } from '../middlewares/authorize.js';
import { createAuthor, deleteAuthor, getAuthorById, updateAuthor } from '../controllers/AuthorController.js';

const router = express.Router();

router.use(auth)
router.use(authorizeRoles("admin"))

router.post("/", createAuthor);
router.put("/:id", updateAuthor);
router.get("/:id", getAuthorById);
router.delete("/:id", deleteAuthor);

export default router;