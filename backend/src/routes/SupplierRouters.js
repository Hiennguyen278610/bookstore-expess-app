import express from 'express';
import { auth } from '../middlewares/auth.js';
import { authorizeRoles } from '../middlewares/authorize.js';
import { createSupplier, deleteSupplier, getSupplierById, updateSupplier,getAllSuppliers } from '../controllers/SupplierController.js';
import { checkEmptyBody } from '../middlewares/checkEmptyBody.js';

const router = express.Router();

//router.use(auth)
//router.use(authorizeRoles("admin"))
//router.use(checkEmptyBody)
router.get("/", getAllSuppliers);
router.post("/", createSupplier);
router.put("/:id", updateSupplier);
router.get("/:id", getSupplierById);
router.delete("/:id", deleteSupplier);

export default router;