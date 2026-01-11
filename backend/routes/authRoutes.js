import express from 'express';
import { loginWithPin } from "../controllers/authController";

const router = express.Router();

router.post('/login', loginWithPin);
export default router;
