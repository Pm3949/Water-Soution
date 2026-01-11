import express from 'express';
import { loginWithPin } from "../controllers/authController.js";

const router = express.Router();

router.post('/login', loginWithPin);
export default router;
