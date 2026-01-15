import express from 'express';
import { getCustomers, addCustomer, updateCustomer, deleteCustomer, sendManualReminder, getOverdueCustomers} from '../controllers/customerController.js';
import { protect, onlyOwner } from '../middleware/authMiddleware.js';

const router = express.Router();

// router.get("/", protect, getCustomers);
// router.post("/add", protect, onlyOwner, addCustomer);
// router.put("/:id", protect, onlyOwner, updateCustomer);
// router.delete("/:id", protect, onlyOwner, deleteCustomer);

// For now without auth:
router.get("/", getCustomers);
router.post("/add", addCustomer);
router.put("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);
router.post("/:id/send-reminder", sendManualReminder);
router.get("/overdue", getOverdueCustomers);

export default router;