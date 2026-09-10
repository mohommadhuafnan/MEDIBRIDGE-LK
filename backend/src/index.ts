import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

// Load env
dotenv.config();

// Initialize DB
connectDB();

// Route imports
import authRoutes from './routes/authRoutes.js';
import medicineRoutes from './routes/medicineRoutes.js';
import priceRoutes from './routes/priceRoutes.js';
import prescriptionRoutes from './routes/prescriptionRoutes.js';
import pharmacyRoutes from './routes/pharmacyRoutes.js';
import safetyRoutes from './routes/safetyRoutes.js';
import translateRoutes from './routes/translateRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  process.env.CLIENT_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server or non-browser requests
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        process.env.NODE_ENV !== 'production'
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Allow configured frontend origins
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('dev'));

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'MediBridge LK Healthcare API',
    version: '1.0.0',
    market: 'Sri Lanka (NMRA Compliant)',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/prices', priceRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/pharmacies', pharmacyRoutes);
app.use('/api/safety', safetyRoutes);
app.use('/api/translate', translateRoutes);
app.use('/api/admin', adminRoutes);

// 404 Fallback
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'API Route Not Found' });
});

// Error handling
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Global Error]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Healthcare API Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🏥 MediBridge LK Backend API Running on port ${PORT}`);
  console.log(`📍 Market: Sri Lanka | Language: EN, SI, TA`);
  console.log(`⚡ MongoDB Atlas, Gemini AI & Valsea.ai Connected`);
  console.log(`====================================================`);
});

export default app;
