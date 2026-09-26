import { Router } from 'express';
import authRoutes from './authRoutes';
import campaignRoutes from './campaignRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/campaigns', campaignRoutes);

// Health check
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
