import express from 'express';
import { auth } from '../middlewares/auth.js';
import { authorizeRoles } from '../middlewares/authorize.js';
import { createAuthor, deleteAuthor, getAuthorById, updateAuthor,getAllAuthors } from '../controllers/AuthorController.js';
import { checkEmptyBody } from '../middlewares/checkEmptyBody.js';

const router = express.Router();

router.use(auth)
router.use(authorizeRoles("admin"))
router.use(checkEmptyBody)
router.post("/", createAuthor);
router.put("/:id", updateAuthor);
router.get("/:id", getAuthorById);
router.delete("/:id", deleteAuthor);
router.get("/", getAllAuthors);

export default router;