import prisma from '../config/database';
import { AppError } from '../middleware/error.middleware';

export interface CreateTankData {
  name: string;
  size: number;
  type?: string;
  description?: string;
  imageUrl?: string;
  userId: string;
}

export interface UpdateTankData {
  name?: string;
  size?: number;
  type?: string;
  description?: string;
  imageUrl?: string;
}

export class TankService {
  // Create a new tank
  async createTank(data: CreateTankData) {
    const tank = await prisma.tank.create({
      data: {
        name: data.name,
        size: data.size,
        type: data.type || 'reef',
        description: data.description,
        imageUrl: data.imageUrl,
        userId: data.userId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });

    return tank;
  }

  // Get all tanks
  async getAllTanks() {
    const tanks = await prisma.tank.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return tanks;
  }

  // Get tank by ID
  async getTankById(id: string) {
    const tank = await prisma.tank.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!tank) {
      throw new AppError('Tank not found', 404);
    }

    return tank;
  }

  // Get tanks by user ID
  async getTanksByUserId(userId: string) {
    const tanks = await prisma.tank.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return tanks;
  }

  // Update tank
  async updateTank(id: string, userId: string, data: UpdateTankData) {
    // Verify the tank belongs to the user
    const existingTank = await prisma.tank.findUnique({
      where: { id },
    });

    if (!existingTank) {
      throw new AppError('Tank not found', 404);
    }

    if (existingTank.userId !== userId) {
      throw new AppError('Unauthorized to update this tank', 403);
    }

    const tank = await prisma.tank.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });

    return tank;
  }

  // Delete tank
  async deleteTank(id: string, userId: string) {
    // Verify the tank belongs to the user
    const existingTank = await prisma.tank.findUnique({
      where: { id },
    });

    if (!existingTank) {
      throw new AppError('Tank not found', 404);
    }

    if (existingTank.userId !== userId) {
      throw new AppError('Unauthorized to delete this tank', 403);
    }

    await prisma.tank.delete({
      where: { id },
    });

    return { message: 'Tank deleted successfully' };
  }
}

export default new TankService();
