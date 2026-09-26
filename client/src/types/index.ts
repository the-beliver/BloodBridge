export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'donor' | 'organizer' | 'volunteer' | 'admin';
  isActive: boolean;
  isVerified: boolean;
  createdAt?: string;
}

export interface DonorProfile {
  _id: string;
  userId: string;
  bloodGroup: BloodGroup;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  totalDonations: number;
  lastDonationDate?: string;
  points: number;
  badges: string[];
}

export interface OrganizerProfile {
  _id: string;
  userId: string;
  organization: string;
  designation?: string;
  organizationType?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  totalCampaigns: number;
}

export type BloodGroup = 'O+' | 'O-' | 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-';

export interface BloodGroupTarget {
  bloodGroup: string;
  required: number;
  registered: number;
  confirmed: number;
  predicted: number;
  actual: number;
}

export type CampaignStatus = 'draft' | 'published' | 'active' | 'completed' | 'cancelled';

export interface Campaign {
  _id: string;
  name: string;
  description: string;
  organizer: string | User;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  address: string;
  city: string;
  state: string;
  contact: string;
  targetDonors: number;
  bloodGroupTargets: BloodGroupTarget[];
  registrationDeadline: string;
  status: CampaignStatus;
  qrCode?: string;
  registrationLink?: string;
  registrationCount: number;
  confirmedCount: number;
  attendedCount: number;
  predictedTurnout?: number;
  predictedNoShow?: number;
  turnoutRescueActive: boolean;
  tags: string[];
  bannerImage?: string;
  createdAt: string;
  updatedAt: string;
}

export type RegistrationStatus = 'registered' | 'confirmed' | 'cancelled' | 'attended' | 'no-show';

export interface Registration {
  _id: string;
  registrationId: string;
  campaign: string | Campaign;
  donor: string | User;
  status: RegistrationStatus;
  bloodGroup: string;
  registeredAt: string;
  confirmedAt?: string;
  cancelledAt?: string;
  attendedAt?: string;
  qrCode?: string;
  remindersSent: number;
  attendanceProbability?: number;
  noShowProbability?: number;
  riskLevel?: 'low' | 'medium' | 'high';
}

export interface Prediction {
  _id: string;
  campaign: string;
  registration?: string;
  donor?: string;
  type: 'donor-risk' | 'campaign-turnout';
  attendanceProbability: number;
  noShowProbability: number;
  riskLevel: 'low' | 'medium' | 'high';
  predictedTurnout?: number;
  predictedNoShow?: number;
  features: Record<string, any>;
  reasons: string[];
  modelVersion: string;
}

export interface Recommendation {
  _id: string;
  campaign: string;
  registration?: string;
  donor?: string | User;
  type: 'follow-up' | 'reminder' | 'rescue' | 'message' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  channel: 'email' | 'sms' | 'whatsapp' | 'volunteer-call';
  message: string;
  language: string;
  status: 'pending' | 'approved' | 'rejected' | 'sent' | 'failed';
  approvedBy?: string;
  approvedAt?: string;
  editedMessage?: string;
  reason: string;
  aiGenerated: boolean;
  createdAt: string;
}

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'campaign' | 'reminder' | 'alert' | 'system' | 'recommendation';
  relatedCampaign?: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface CampaignAnalytics {
  _id: string;
  campaign: string;
  totalRegistered: number;
  totalConfirmed: number;
  totalAttended: number;
  totalNoShow: number;
  totalCancelled: number;
  predictedTurnout: number;
  actualTurnout: number;
  turnoutRate: number;
  noShowRate: number;
  predictionAccuracy: number;
  bloodGroupDistribution: Record<string, number>;
  riskDistribution: { low: number; medium: number; high: number };
  followUpEffectiveness: number;
}

export interface FollowUp {
  _id: string;
  campaign: string | Campaign;
  registration: string;
  donor: string | User;
  assignedTo?: string | User;
  channel: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed' | 'skipped';
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  outcome?: string;
}
