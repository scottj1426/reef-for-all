import prisma from '../config/database';
import { AppError } from '../middleware/error.middleware';

export interface SyncUserData {
  auth0Id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  emailVerified?: boolean;
}

export class UserService {
  // Sync user from Auth0 (create or update)
  async syncUser(data: SyncUserData) {
    const user = await prisma.user.upsert({
      where: { auth0Id: data.auth0Id },
      create: {
        auth0Id: data.auth0Id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        avatarUrl: data.avatarUrl,
        emailVerified: data.emailVerified || false,
      },
      update: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        avatarUrl: data.avatarUrl,
        emailVerified: data.emailVerified,
        updatedAt: new Date(),
      },
    });

    return user;
  }

  // Get user by Auth0 ID
  async getUserByAuth0Id(auth0Id: string) {
    const user = await prisma.user.findUnique({
      where: { auth0Id },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  // Update user profile
  async updateProfile(auth0Id: string, data: {
    username?: string;
    firstName?: string;
    lastName?: string;
    bio?: string;
    location?: string;
    avatarUrl?: string;
  }) {
    const user = await prisma.user.update({
      where: { auth0Id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    return user;
  }

  // Get all users
  async getAllUsers() {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return users;
  }
}

export default new UserService();
