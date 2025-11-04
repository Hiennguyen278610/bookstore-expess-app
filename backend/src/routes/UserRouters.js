import express from 'express';
import { getAll, getById } from '../controllers/AuthController.js';
import { auth } from '../middlewares/auth.js';
import { authorizeRoles } from '../middlewares/authorize.js';

//kenh nay cho admin nhe'
const router = express.Router();
router.use(auth)
router.use(authorizeRoles("admin"))

router.get('/', auth, authorizeRoles('admin'), getAll);

router.get("/:id", getById);


export default router;