import express from "express";
import { auth } from "../middlewares/auth.js";
import { authorizeRoles } from "../middlewares/authorize.js";
import {
  createPublisher,
  deletePublisher,
  getAllPublishers,
  getPublisherById,
  updatePublisher,
} from "../controllers/PublisherController.js";
import { checkEmptyBody } from "../middlewares/checkEmptyBody.js";

const router = express.Router();

router.get("/", getAllPublishers);

router.use(auth);
router.use(authorizeRoles("admin"));
router.use(checkEmptyBody);

router.post("/", createPublisher);
router.put("/:id", updatePublisher);
router.get("/:id", getPublisherById);
router.delete("/:id", deletePublisher);

export default router;
