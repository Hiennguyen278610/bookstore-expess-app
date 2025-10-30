import express from 'express';
import { auth } from '../middlewares/auth.js';
import { authorizeRoles } from '../middlewares/authorize.js';
import {
  createPublisher,
  deletePublisher,
  getPublisherById,
  updatePublisher
} from '../controllers/PublisherController.js';

const router = express.Router();

router.use(auth)
router.use(authorizeRoles("admin"))

router.post("/", createPublisher);
router.put("/:id", updatePublisher);
router.get("/:id", getPublisherById);
router.delete("/:id", deletePublisher);

export default router;