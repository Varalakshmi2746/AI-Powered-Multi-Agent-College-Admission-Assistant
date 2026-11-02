import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import College from './models/College.js';
import { seedDatabase } from './seeders/seedData.js';

import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import collegeRoutes from './routes/collegeRoutes.js';
import eligibilityRoutes from './routes/eligibilityRoutes.js';
import feeRoutes from './routes/feeRoutes.js';
import comparisonRoutes from './routes/comparisonRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'AI-Powered Multi-Agent College Admission Assistant Backend',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/colleges', collegeRoutes);
app.use('/api/eligibility', eligibilityRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/compare', comparisonRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/admin', adminRoutes);

// Error Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Initialize Server
const startServer = async () => {
  try {
    await connectDB();
    
    // Auto-seed if database is empty
    const count = await College.countDocuments();
    if (count === 0) {
      console.log('[Bootstrap] No existing colleges detected. Automatically populating database with verified sample dataset...');
      await seedDatabase();
    }

    const server = app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`🚀 Multi-Agent Admission Assistant Backend is Running`);
      console.log(`📡 URL: http://localhost:${PORT}`);
      console.log(`🛡️ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`=======================================================`);
    });

    return server;
  } catch (err) {
    console.error(`[Fatal Server Error]: ${err.message}`);
    process.exit(1);
  }
};

startServer();

export default app;
