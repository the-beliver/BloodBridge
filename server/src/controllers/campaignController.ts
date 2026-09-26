import { Response } from 'express';
import mongoose from 'mongoose';
import Campaign from '../models/Campaign';
import Registration from '../models/Registration';
import DonorProfile from '../models/DonorProfile';
import { AuthRequest } from '../middleware/auth';
import { ApiResponse } from '../utils/ApiResponse';
import QRCode from 'qrcode';
import config from '../config';

// Generate unique registration ID
const generateRegistrationId = (): string => {
  const prefix = 'DP';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

// Create Campaign
export const createCampaign = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      ApiResponse.error(res, 'Not authenticated', 401);
      return;
    }

    const campaignData = {
      ...req.body,
      organizer: req.user._id,
    };

    // Initialize blood group targets if not provided
    if (!campaignData.bloodGroupTargets || campaignData.bloodGroupTargets.length === 0) {
      const groups = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
      const perGroup = Math.floor(campaignData.targetDonors / groups.length);
      campaignData.bloodGroupTargets = groups.map((bg) => ({
        bloodGroup: bg,
        required: perGroup,
        registered: 0,
        confirmed: 0,
        predicted: 0,
        actual: 0,
      }));
    }

    const campaign = await Campaign.create(campaignData);

    // Generate registration link
    const registrationLink = `${config.urls.client}/campaign/${campaign._id}/register`;
    
    // Generate QR code
    const qrCode = await QRCode.toDataURL(registrationLink, {
      width: 400,
      margin: 2,
      color: {
        dark: '#dc2626',
        light: '#0a0a1a',
      },
    });

    campaign.registrationLink = registrationLink;
    campaign.qrCode = qrCode;
    await campaign.save();

    ApiResponse.created(res, campaign, 'Campaign created successfully');
  } catch (error: any) {
    console.error('Create campaign error:', error);
    ApiResponse.error(res, error.message || 'Failed to create campaign', 500);
  }
};

// Get all campaigns
export const getCampaigns = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, page = '1', limit = '20' } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    const filter: any = {};
    
    // Non-admin non-organizer users see only published/active campaigns
    if (req.user?.role === 'organizer') {
      filter.$or = [
        { organizer: req.user._id },
        { status: { $in: ['published', 'active', 'completed'] } },
      ];
    } else if (req.user?.role === 'donor' || req.user?.role === 'volunteer') {
      filter.status = { $in: ['published', 'active', 'completed'] };
    }

    if (status) {
      filter.status = status;
    }

    const total = await Campaign.countDocuments(filter);
    const campaigns = await Campaign.find(filter)
      .populate('organizer', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    ApiResponse.paginated(res, campaigns, total, pageNum, limitNum, 'Campaigns retrieved');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Failed to get campaigns', 500);
  }
};

// Get single campaign
export const getCampaign = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate('organizer', 'firstName lastName email phone');

    if (!campaign) {
      ApiResponse.error(res, 'Campaign not found', 404);
      return;
    }

    // Get registration counts by status
    const registrations = await Registration.aggregate([
      { $match: { campaign: campaign._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const regCounts: Record<string, number> = {};
    registrations.forEach((r) => { regCounts[r._id] = r.count; });

    ApiResponse.success(res, {
      campaign,
      registrationCounts: regCounts,
    });
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Failed to get campaign', 500);
  }
};

// Get campaign by ID (public - for registration)
export const getPublicCampaign = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .select('name description date startTime endTime location address city state contact targetDonors bloodGroupTargets registrationDeadline status bannerImage registrationCount')
      .populate('organizer', 'firstName lastName');

    if (!campaign) {
      ApiResponse.error(res, 'Campaign not found', 404);
      return;
    }

    if (campaign.status === 'draft' || campaign.status === 'cancelled') {
      ApiResponse.error(res, 'Campaign is not available for registration', 400);
      return;
    }

    ApiResponse.success(res, campaign);
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Failed to get campaign', 500);
  }
};

// Update Campaign
export const updateCampaign = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      ApiResponse.error(res, 'Campaign not found', 404);
      return;
    }

    if (campaign.organizer.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
      ApiResponse.error(res, 'Not authorized', 403);
      return;
    }

    const updated = await Campaign.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    ApiResponse.success(res, updated, 'Campaign updated');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Failed to update campaign', 500);
  }
};

// Publish Campaign
export const publishCampaign = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      ApiResponse.error(res, 'Campaign not found', 404);
      return;
    }

    if (campaign.organizer.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
      ApiResponse.error(res, 'Not authorized', 403);
      return;
    }

    if (campaign.status !== 'draft') {
      ApiResponse.error(res, 'Only draft campaigns can be published', 400);
      return;
    }

    campaign.status = 'published';

    // Generate QR if not exists
    if (!campaign.registrationLink) {
      campaign.registrationLink = `${config.urls.client}/campaign/${campaign._id}/register`;
    }
    if (!campaign.qrCode) {
      campaign.qrCode = await QRCode.toDataURL(campaign.registrationLink, {
        width: 400,
        margin: 2,
        color: { dark: '#dc2626', light: '#0a0a1a' },
      });
    }

    await campaign.save();
    ApiResponse.success(res, campaign, 'Campaign published');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Failed to publish campaign', 500);
  }
};

// Register for Campaign (Donor)
export const registerForCampaign = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      ApiResponse.error(res, 'Not authenticated', 401);
      return;
    }

    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      ApiResponse.error(res, 'Campaign not found', 404);
      return;
    }

    if (campaign.status !== 'published' && campaign.status !== 'active') {
      ApiResponse.error(res, 'Campaign is not accepting registrations', 400);
      return;
    }

    // Check if registration deadline passed
    if (new Date() > new Date(campaign.registrationDeadline)) {
      ApiResponse.error(res, 'Registration deadline has passed', 400);
      return;
    }

    // Check if already registered
    const existing = await Registration.findOne({
      campaign: campaign._id,
      donor: req.user._id,
    });
    if (existing) {
      ApiResponse.error(res, 'You are already registered for this campaign', 409);
      return;
    }

    // Get donor's blood group
    const donorProfile = await DonorProfile.findOne({ userId: req.user._id });
    const bloodGroup = req.body.bloodGroup || donorProfile?.bloodGroup || 'O+';

    const registrationId = generateRegistrationId();

    // Generate QR for registration
    const regQR = await QRCode.toDataURL(
      JSON.stringify({ regId: registrationId, campaign: campaign._id.toString(), donor: req.user._id.toString() }),
      { width: 300, margin: 2, color: { dark: '#dc2626', light: '#0a0a1a' } }
    );

    const registration = await Registration.create({
      registrationId,
      campaign: campaign._id,
      donor: req.user._id,
      bloodGroup,
      qrCode: regQR,
    });

    // Update campaign counts
    campaign.registrationCount = (campaign.registrationCount || 0) + 1;

    // Update blood group target counts
    const bgTarget = campaign.bloodGroupTargets.find((t) => t.bloodGroup === bloodGroup);
    if (bgTarget) {
      bgTarget.registered = (bgTarget.registered || 0) + 1;
    }

    await campaign.save();

    ApiResponse.created(res, {
      registration,
      registrationId,
    }, 'Registration successful');
  } catch (error: any) {
    console.error('Register for campaign error:', error);
    ApiResponse.error(res, error.message || 'Registration failed', 500);
  }
};

// Get registrations for a campaign
export const getCampaignRegistrations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = '1', limit = '50', status, riskLevel } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    const filter: any = { campaign: new mongoose.Types.ObjectId(req.params.id) };
    if (status) filter.status = status;
    if (riskLevel) filter.riskLevel = riskLevel;

    const total = await Registration.countDocuments(filter);
    const registrations = await Registration.find(filter)
      .populate('donor', 'firstName lastName email phone')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    ApiResponse.paginated(res, registrations, total, pageNum, limitNum);
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Failed to get registrations', 500);
  }
};

// Get donor's registrations
export const getMyRegistrations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      ApiResponse.error(res, 'Not authenticated', 401);
      return;
    }

    const registrations = await Registration.find({ donor: req.user._id })
      .populate({
        path: 'campaign',
        select: 'name date startTime endTime location city status',
      })
      .sort({ createdAt: -1 });

    ApiResponse.success(res, registrations);
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Failed to get registrations', 500);
  }
};

// Confirm registration
export const confirmRegistration = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const registration = await Registration.findById(req.params.regId);
    if (!registration) {
      ApiResponse.error(res, 'Registration not found', 404);
      return;
    }

    if (registration.donor.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
      // Check if user is campaign organizer
      const campaign = await Campaign.findById(registration.campaign);
      if (!campaign || campaign.organizer.toString() !== req.user?._id.toString()) {
        ApiResponse.error(res, 'Not authorized', 403);
        return;
      }
    }

    if (registration.status !== 'registered') {
      ApiResponse.error(res, 'Can only confirm a registered status', 400);
      return;
    }

    registration.status = 'confirmed';
    registration.confirmedAt = new Date();
    await registration.save();

    // Update campaign confirmed count
    const campaign = await Campaign.findById(registration.campaign);
    if (campaign) {
      campaign.confirmedCount = (campaign.confirmedCount || 0) + 1;
      const bgTarget = campaign.bloodGroupTargets.find((t) => t.bloodGroup === registration.bloodGroup);
      if (bgTarget) {
        bgTarget.confirmed = (bgTarget.confirmed || 0) + 1;
      }
      await campaign.save();
    }

    ApiResponse.success(res, registration, 'Registration confirmed');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Failed to confirm registration', 500);
  }
};

// Cancel registration
export const cancelRegistration = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const registration = await Registration.findById(req.params.regId);
    if (!registration) {
      ApiResponse.error(res, 'Registration not found', 404);
      return;
    }

    if (registration.donor.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
      ApiResponse.error(res, 'Not authorized', 403);
      return;
    }

    if (registration.status === 'attended' || registration.status === 'cancelled') {
      ApiResponse.error(res, 'Cannot cancel this registration', 400);
      return;
    }

    const prevStatus = registration.status;
    registration.status = 'cancelled';
    registration.cancelledAt = new Date();
    await registration.save();

    // Update campaign counts
    const campaign = await Campaign.findById(registration.campaign);
    if (campaign) {
      campaign.registrationCount = Math.max(0, (campaign.registrationCount || 0) - 1);
      if (prevStatus === 'confirmed') {
        campaign.confirmedCount = Math.max(0, (campaign.confirmedCount || 0) - 1);
      }
      const bgTarget = campaign.bloodGroupTargets.find((t) => t.bloodGroup === registration.bloodGroup);
      if (bgTarget) {
        bgTarget.registered = Math.max(0, (bgTarget.registered || 0) - 1);
        if (prevStatus === 'confirmed') {
          bgTarget.confirmed = Math.max(0, (bgTarget.confirmed || 0) - 1);
        }
      }
      await campaign.save();
    }

    ApiResponse.success(res, registration, 'Registration cancelled');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Failed to cancel registration', 500);
  }
};

// Mark attendance
export const markAttendance = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { registrationIds } = req.body;

    if (!registrationIds || !Array.isArray(registrationIds) || registrationIds.length === 0) {
      ApiResponse.error(res, 'Registration IDs are required', 400);
      return;
    }

    const results = [];
    for (const regId of registrationIds) {
      const registration = await Registration.findById(regId);
      if (!registration) continue;

      if (registration.status !== 'attended') {
        registration.status = 'attended';
        registration.attendedAt = new Date();
        await registration.save();

        // Update campaign
        const campaign = await Campaign.findById(registration.campaign);
        if (campaign) {
          campaign.attendedCount = (campaign.attendedCount || 0) + 1;
          const bgTarget = campaign.bloodGroupTargets.find((t) => t.bloodGroup === registration.bloodGroup);
          if (bgTarget) {
            bgTarget.actual = (bgTarget.actual || 0) + 1;
          }
          await campaign.save();
        }

        results.push({ id: regId, status: 'attended' });
      }
    }

    ApiResponse.success(res, results, `${results.length} attendance records updated`);
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Failed to mark attendance', 500);
  }
};
