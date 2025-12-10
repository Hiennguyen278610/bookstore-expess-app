import express from 'express';
import { auth } from '../middlewares/auth.js';
import { authorizeRoles } from '../middlewares/authorize.js';
import {
  getAllSupplyReceipts,
  getSupplyReceiptById,
  createSupplyReceipt,
  updateSupplyReceipt,
  deleteSupplyReceipt,
  updateSupplyReceiptStatus,
  getSupplyReceiptStats
} from '../controllers/SupplyReceiptController.js';

const router = express.Router();
router.use(auth);
router.use(authorizeRoles("admin"));

// Routes
router.get("/", getAllSupplyReceipts);                    // GET /api/v1/supply-receipts
router.get("/stats", getSupplyReceiptStats);              // GET /api/v1/supply-receipts/stats
router.get("/:id", getSupplyReceiptById);                 // GET /api/v1/supply-receipts/:id
router.post("/", createSupplyReceipt);                    // POST /api/v1/supply-receipts
router.put("/:id", updateSupplyReceipt);                  // PUT /api/v1/supply-receipts/:id
router.patch("/:id/status", updateSupplyReceiptStatus);   // PATCH /api/v1/supply-receipts/:id/status
router.delete("/:id", deleteSupplyReceipt);               // DELETE /api/v1/supply-receipts/:id

export default router;
