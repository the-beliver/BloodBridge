import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import {
  createCampaign,
  getCampaigns,
  getCampaign,
  getPublicCampaign,
  updateCampaign,
  publishCampaign,
  registerForCampaign,
  getCampaignRegistrations,
  getMyRegistrations,
  confirmRegistration,
  cancelRegistration,
  markAttendance,
} from '../controllers/campaignController';

const router = Router();

// Public route - for QR scan / registration link
router.get('/public/:id', getPublicCampaign);

// Authenticated routes
router.use(authenticate);

// Campaign CRUD
router.post('/', authorize('organizer', 'admin'), createCampaign);
router.get('/', getCampaigns);
router.get('/my-registrations', getMyRegistrations);
router.get('/:id', getCampaign);
router.put('/:id', authorize('organizer', 'admin'), updateCampaign);
router.post('/:id/publish', authorize('organizer', 'admin'), publishCampaign);

// Registration
router.post('/:id/register', authorize('donor'), registerForCampaign);
router.get('/:id/registrations', authorize('organizer', 'admin', 'volunteer'), getCampaignRegistrations);
router.patch('/registrations/:regId/confirm', confirmRegistration);
router.patch('/registrations/:regId/cancel', cancelRegistration);

// Attendance
router.post('/:id/attendance', authorize('organizer', 'admin', 'volunteer'), markAttendance);

export default router;
