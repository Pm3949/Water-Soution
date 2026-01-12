import express from "express";
import {
  bootstrapOwner,
  login,
  createWorker,
  resetWorkerPin,
  listWorkers,
  deleteWorker,
  updateWorker,
  searchWorker,
  changePin,
} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// PUBLIC
router.post("/bootstrap-owner", bootstrapOwner); // only once
router.post("/login", login);

// OWNER ONLY
router.post("/workers", protect, createWorker);
router.get("/workers", protect, listWorkers);
router.put("/workers/:id", protect, updateWorker);
router.delete("/workers/:id", protect, deleteWorker);
router.get("/workers/search", protect, searchWorker);
router.put("/workers/:id/reset-pin", protect, resetWorkerPin);

// BOTH OWNER + WORKER
router.put("/change-pin", protect, changePin);

export default router;
