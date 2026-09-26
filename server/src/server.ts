import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import config from './config';
import connectDB from './config/database';
import routes from './routes';
import errorHandler from './middleware/errorHandler';

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: config.urls.client,
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// API routes
app.use('/api', routes);

// Root
app.get('/', (_req, res) => {
  res.json({
    name: 'DonorPulse API',
    version: '1.0.0',
    tagline: 'Connecting Donors. Predicting Turnout. Saving Lives.',
    status: 'running',
  });
});

// Error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(config.port, () => {
      console.log(`
╔══════════════════════════════════════════════╗
║               DONORPULSE API                ║
║──────────────────────────────────────────────║
║  Server:  http://localhost:${config.port}            ║
║  Mode:    ${config.nodeEnv.padEnd(33)}║
║  MongoDB: Connected ✅                      ║
╚══════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
