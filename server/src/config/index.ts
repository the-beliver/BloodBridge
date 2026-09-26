import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env.example') });

// Try loading actual .env if it exists
dotenv.config({ path: path.join(__dirname, '../../.env') });

const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/donorpulse',
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-jwt-secret-change-in-production',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  cohere: {
    apiKey: process.env.COHERE_API_KEY || '',
  },
  urls: {
    client: process.env.CLIENT_URL || 'http://localhost:5173',
    server: process.env.SERVER_URL || 'http://localhost:5000',
    mlService: process.env.ML_SERVICE_URL || 'http://localhost:8000',
  },
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    user: process.env.EMAIL_USER || '',
    password: process.env.EMAIL_PASSWORD || '',
  },
};

export default config;
