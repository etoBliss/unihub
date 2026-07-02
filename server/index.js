import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

// Initialize environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Global Middleware Matrix
app.use(cors());
app.use(express.json()); // Allows the server to parse JSON payloads in request bodies

// API Route Registration
app.use('/api/auth', authRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/messages', messageRoutes);

// Base Test Route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'UniHub OGB API Operational' });
});

// Fire up Server Instance
app.listen(PORT, () => {
  console.log(`Server executing seamlessly on port ${PORT}`);
});
