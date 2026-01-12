import express from 'express';
import {protect} from '../middleware/authMiddleware.js';
import { changePin, createWorker, resetWorkerPin, listWorkers, deleteWorker, updateWorker, searchWorker } from '../controllers/userController.js';


const router = express.Router();
// public (only works first time)
router.post("/create-worker", protect, createWorker);

// owner only
router.get("/workers", protect, listWorkers);
router.put("/workers/:id", protect, updateWorker);
router.delete("/workers/:id", protect, deleteWorker);
router.get("/workers/search", protect, searchWorker);
router.post("/reset-worker/:id", protect, resetWorkerPin);

// both owner + worker
router.post("/change-pin", protect, changePin);


export default router;