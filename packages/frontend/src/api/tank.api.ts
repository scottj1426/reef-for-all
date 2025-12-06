import apiClient from './client';

export interface Tank {
  id: string;
  name: string;
  size: number;
  type: string;
  description?: string;
  imageUrl?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
  };
}

export interface CreateTankData {
  name: string;
  size: number;
  type?: string;
  description?: string;
  imageUrl?: string;
  userId: string;
}

export const tankApi = {
  // Get all tanks
  getAllTanks: async (): Promise<Tank[]> => {
    const response = await apiClient.get<Tank[]>('/tanks');
    return response.data;
  },

  // Get tank by ID
  getTankById: async (id: string): Promise<Tank> => {
    const response = await apiClient.get<Tank>(`/tanks/${id}`);
    return response.data;
  },

  // Get tanks by user ID
  getTanksByUserId: async (userId: string): Promise<Tank[]> => {
    const response = await apiClient.get<Tank[]>(`/tanks/user/${userId}`);
    return response.data;
  },

  // Create tank
  createTank: async (data: CreateTankData, token: string): Promise<Tank> => {
    const response = await apiClient.post<Tank>('/tanks', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Update tank
  updateTank: async (id: string, data: Partial<CreateTankData>, token: string): Promise<Tank> => {
    const response = await apiClient.put<Tank>(`/tanks/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Delete tank
  deleteTank: async (id: string, userId: string, token: string): Promise<void> => {
    await apiClient.delete(`/tanks/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { userId },
    });
  },
};
