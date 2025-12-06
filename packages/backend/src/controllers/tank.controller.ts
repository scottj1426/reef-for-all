import { Request, Response, NextFunction } from 'express';
import tankService from '../services/tank.service';

export class TankController {
  // POST /api/tanks - Create a new tank
  async createTank(req: Request, res: Response, next: NextFunction) {
    try {
      const auth0Id = req.auth?.payload?.sub;
      if (!auth0Id) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { name, size, type, description, imageUrl, userId } = req.body;

      if (!name || !size) {
        return res.status(400).json({ error: 'Name and size are required' });
      }

      const tank = await tankService.createTank({
        name,
        size: parseInt(size),
        type,
        description,
        imageUrl,
        userId,
      });

      res.status(201).json(tank);
    } catch (error) {
      next(error);
    }
  }

  // GET /api/tanks - Get all tanks
  async getAllTanks(req: Request, res: Response, next: NextFunction) {
    try {
      const tanks = await tankService.getAllTanks();
      res.json(tanks);
    } catch (error) {
      next(error);
    }
  }

  // GET /api/tanks/:id - Get tank by ID
  async getTankById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const tank = await tankService.getTankById(id);
      res.json(tank);
    } catch (error) {
      next(error);
    }
  }

  // GET /api/tanks/user/:userId - Get tanks by user ID
  async getTanksByUserId(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const tanks = await tankService.getTanksByUserId(userId);
      res.json(tanks);
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/tanks/:id - Update tank
  async updateTank(req: Request, res: Response, next: NextFunction) {
    try {
      const auth0Id = req.auth?.payload?.sub;
      if (!auth0Id) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { id } = req.params;
      const { name, size, type, description, imageUrl, userId } = req.body;

      const tank = await tankService.updateTank(id, userId, {
        name,
        size: size ? parseInt(size) : undefined,
        type,
        description,
        imageUrl,
      });

      res.json(tank);
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/tanks/:id - Delete tank
  async deleteTank(req: Request, res: Response, next: NextFunction) {
    try {
      const auth0Id = req.auth?.payload?.sub;
      if (!auth0Id) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { id } = req.params;
      const { userId } = req.body;

      const result = await tankService.deleteTank(id, userId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new TankController();
