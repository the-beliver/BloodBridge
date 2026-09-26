import api from './api';
import { ApiResponse, Campaign, Registration } from '../types';

export const campaignService = {
  // Create campaign
  create: async (data: Partial<Campaign>): Promise<ApiResponse<Campaign>> => {
    const response = await api.post('/campaigns', data);
    return response.data;
  },

  // Get all campaigns
  getAll: async (params?: { status?: string; page?: number; limit?: number }): Promise<ApiResponse<Campaign[]>> => {
    const response = await api.get('/campaigns', { params });
    return response.data;
  },

  // Get single campaign
  getById: async (id: string): Promise<ApiResponse<{ campaign: Campaign; registrationCounts: Record<string, number> }>> => {
    const response = await api.get(`/campaigns/${id}`);
    return response.data;
  },

  // Get public campaign (for registration page)
  getPublic: async (id: string): Promise<ApiResponse<Campaign>> => {
    const response = await api.get(`/campaigns/public/${id}`);
    return response.data;
  },

  // Update campaign
  update: async (id: string, data: Partial<Campaign>): Promise<ApiResponse<Campaign>> => {
    const response = await api.put(`/campaigns/${id}`, data);
    return response.data;
  },

  // Publish campaign
  publish: async (id: string): Promise<ApiResponse<Campaign>> => {
    const response = await api.post(`/campaigns/${id}/publish`);
    return response.data;
  },

  // Register for campaign
  register: async (id: string, data?: { bloodGroup?: string }): Promise<ApiResponse<{ registration: Registration; registrationId: string }>> => {
    const response = await api.post(`/campaigns/${id}/register`, data);
    return response.data;
  },

  // Get campaign registrations
  getRegistrations: async (id: string, params?: { page?: number; limit?: number; status?: string; riskLevel?: string }): Promise<ApiResponse<Registration[]>> => {
    const response = await api.get(`/campaigns/${id}/registrations`, { params });
    return response.data;
  },

  // Get my registrations (donor)
  getMyRegistrations: async (): Promise<ApiResponse<Registration[]>> => {
    const response = await api.get('/campaigns/my-registrations');
    return response.data;
  },

  // Confirm registration
  confirmRegistration: async (regId: string): Promise<ApiResponse<Registration>> => {
    const response = await api.patch(`/campaigns/registrations/${regId}/confirm`);
    return response.data;
  },

  // Cancel registration
  cancelRegistration: async (regId: string): Promise<ApiResponse<Registration>> => {
    const response = await api.patch(`/campaigns/registrations/${regId}/cancel`);
    return response.data;
  },

  // Mark attendance
  markAttendance: async (campaignId: string, registrationIds: string[]): Promise<ApiResponse<any>> => {
    const response = await api.post(`/campaigns/${campaignId}/attendance`, { registrationIds });
    return response.data;
  },
};
