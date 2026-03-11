import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './dbConfig/dbConfig.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import authRoute from './routes/authRoutes.js'
import contacrRoute from './routes/contactRoutes.js'
// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', authRoute);
app.use('/api/contacts', contacrRoute);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

