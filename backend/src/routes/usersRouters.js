import express from "express";
import controller from "../controllers/userController.js";

const router = express.Router();

router.get("/", controller.getAll);

router.get("/1", controller.getById);

export default router;