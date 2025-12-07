import express from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.FRONTEND_URL,
].filter((origin): origin is string => !!origin); // type-safe filter

console.log('🔧 CORS Allowed Origins:', allowedOrigins);
console.log('🌍 FRONTEND_URL from env:', process.env.FRONTEND_URL);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Origin:', req.get('origin'));
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes (no /api prefix - Vercel handles that)
app.use('/', routes);

// Error handling
app.use(errorHandler);

export default app;
