import express from "express";
import { protect, onlyOwner } from '../middleware/authMiddleware.js';
import {
  createService,
  getPendingServices,
  completeService,
} from "../controllers/serviceController.js";

const router = express.Router();

// router.post("/", createService);
// router.get("/pending", getPendingServices);
// router.patch("/:id/complete", completeService);

router.post("/", protect, createService);
router.get("/pending", protect, getPendingServices);
router.patch("/:id/complete", protect, completeService);

export default router;
