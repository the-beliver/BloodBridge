import api from './api';
import { AuthResponse, ApiResponse } from '../types';

export const authService = {
  register: async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    role?: string;
    bloodGroup?: string;
    organization?: string;
    organizationType?: string;
  }): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: {
    email: string;
    password: string;
  }): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  refreshToken: async (refreshToken: string): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> => {
    const response = await api.post('/auth/refresh-token', { refreshToken });
    return response.data;
  },

  getMe: async (): Promise<ApiResponse<{ user: any; profile: any }>> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};
