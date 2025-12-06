import apiClient from './client';

export interface User {
  id: string;
  auth0Id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatarUrl?: string;
  location?: string;
  subscriptionTier: string;
  createdAt: string;
  updatedAt: string;
  emailVerified: boolean;
}

export interface SyncUserData {
  email: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
  email_verified?: boolean;
}

export const userApi = {
  // Sync user from Auth0
  syncUser: async (data: SyncUserData, token: string): Promise<User> => {
    const response = await apiClient.post<User>('/users/sync', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Get current user
  getMe: async (token: string): Promise<User> => {
    const response = await apiClient.get<User>('/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Update current user
  updateMe: async (data: Partial<User>, token: string): Promise<User> => {
    const response = await apiClient.put<User>('/users/me', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};
