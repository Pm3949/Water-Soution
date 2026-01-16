import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import customerRoutes from './routes/customerRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js'
import "./utils/reminderJob.js";
import { sendWhatsapp, sendSMS } from './utils/messageService.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
});

app.use('/customers', customerRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/services', serviceRoutes);

app.get('/', (req, res) => {
    res.send('RO Digital Service Backend is running');
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// sendWhatsapp('+917623949059', 'Manav');
// sendSMS('+917623949059', 'Manav');