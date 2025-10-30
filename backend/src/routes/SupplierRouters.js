import express from 'express';
import { auth } from '../middlewares/auth.js';
import { authorizeRoles } from '../middlewares/authorize.js';
import { createSupplier, deleteSupplier, getSupplierById, updateSupplier } from '../controllers/SupplierController.js';

const router = express.Router();

router.use(auth)
router.use(authorizeRoles("admin"))

router.post("/", createSupplier);
router.put("/:id", updateSupplier);
router.get("/:id", getSupplierById);
router.delete("/:id", deleteSupplier);

export default router;