import { Request, Response, NextFunction } from 'express';
import userService from '../services/user.service';

export class UserController {
  // POST /api/users/sync - Sync user from Auth0
  async syncUser(req: Request, res: Response, next: NextFunction) {
    try {
      const auth0Id = req.auth?.payload?.sub;
      if (!auth0Id) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { email, firstName, lastName, picture, email_verified } = req.body;

      const user = await userService.syncUser({
        auth0Id,
        email,
        firstName,
        lastName,
        avatarUrl: picture,
        emailVerified: email_verified,
      });

      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  // GET /api/users/me - Get current user profile
  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const auth0Id = req.auth?.payload?.sub;
      if (!auth0Id) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const user = await userService.getUserByAuth0Id(auth0Id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/users/me - Update current user profile
  async updateMe(req: Request, res: Response, next: NextFunction) {
    try {
      const auth0Id = req.auth?.payload?.sub;
      if (!auth0Id) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { username, firstName, lastName, bio, location, avatarUrl } = req.body;

      const user = await userService.updateProfile(auth0Id, {
        username,
        firstName,
        lastName,
        bio,
        location,
        avatarUrl,
      });

      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  // GET /api/users - Get all users
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
