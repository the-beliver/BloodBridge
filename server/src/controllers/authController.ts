import { Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import DonorProfile from '../models/DonorProfile';
import OrganizerProfile from '../models/OrganizerProfile';
import CommunicationPreference from '../models/CommunicationPreference';
import config from '../config';
import { AuthRequest } from '../middleware/auth';
import { ApiResponse } from '../utils/ApiResponse';

const generateTokens = (userId: string, role: string) => {
  const accessToken = jwt.sign({ userId, role }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn as any,
  });

  const refreshToken = jwt.sign({ userId, role }, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn as any,
  });

  return { accessToken, refreshToken };
};

export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, password, phone, role, bloodGroup, organization, organizationType } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      ApiResponse.error(res, 'Email already registered', 409);
      return;
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone: phone || '',
      role: role || 'donor',
    });

    // Create role-specific profile
    if (role === 'donor' || !role) {
      await DonorProfile.create({
        userId: user._id,
        bloodGroup: bloodGroup || 'O+',
      });
    }

    if (role === 'organizer') {
      await OrganizerProfile.create({
        userId: user._id,
        organization: organization || '',
        organizationType: organizationType || 'other',
      });
    }

    // Create default communication preferences
    await CommunicationPreference.create({
      userId: user._id,
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(
      user._id.toString(),
      user.role
    );

    // Save refresh token
    await User.findByIdAndUpdate(user._id, { refreshToken });

    const userData = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
    };

    ApiResponse.created(res, {
      user: userData,
      accessToken,
      refreshToken,
    }, 'Registration successful');
  } catch (error: any) {
    console.error('Register error:', error);
    ApiResponse.error(res, error.message || 'Registration failed', 500);
  }
};

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user with password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      ApiResponse.error(res, 'Invalid email or password', 401);
      return;
    }

    if (!user.isActive) {
      ApiResponse.error(res, 'Account is deactivated', 403);
      return;
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      ApiResponse.error(res, 'Invalid email or password', 401);
      return;
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(
      user._id.toString(),
      user.role
    );

    // Update refresh token and last login
    await User.findByIdAndUpdate(user._id, {
      refreshToken,
      lastLogin: new Date(),
    });

    const userData = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
    };

    ApiResponse.success(res, {
      user: userData,
      accessToken,
      refreshToken,
    }, 'Login successful');
  } catch (error: any) {
    console.error('Login error:', error);
    ApiResponse.error(res, error.message || 'Login failed', 500);
  }
};

export const refreshToken = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      ApiResponse.error(res, 'Refresh token required', 400);
      return;
    }

    const decoded = jwt.verify(token, config.jwt.refreshSecret) as {
      userId: string;
      role: string;
    };

    const user = await User.findById(decoded.userId).select('+refreshToken');

    if (!user || user.refreshToken !== token) {
      ApiResponse.error(res, 'Invalid refresh token', 401);
      return;
    }

    const tokens = generateTokens(user._id.toString(), user.role);

    await User.findByIdAndUpdate(user._id, {
      refreshToken: tokens.refreshToken,
    });

    ApiResponse.success(res, tokens, 'Token refreshed');
  } catch (error) {
    ApiResponse.error(res, 'Invalid refresh token', 401);
  }
};

export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
    }
    ApiResponse.success(res, null, 'Logged out successfully');
  } catch (error) {
    ApiResponse.error(res, 'Logout failed', 500);
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      ApiResponse.error(res, 'Not authenticated', 401);
      return;
    }

    const user = req.user;
    let profile: any = null;

    if (user.role === 'donor') {
      profile = await DonorProfile.findOne({ userId: user._id });
    } else if (user.role === 'organizer') {
      profile = await OrganizerProfile.findOne({ userId: user._id });
    }

    ApiResponse.success(res, {
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        isVerified: user.isVerified,
        createdAt: (user as any).createdAt,
      },
      profile,
    });
  } catch (error) {
    ApiResponse.error(res, 'Failed to get user', 500);
  }
};
