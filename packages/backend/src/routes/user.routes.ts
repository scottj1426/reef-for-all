import { Router } from 'express';
import userController from '../controllers/user.controller';
import { checkJwt, requireAuth } from '../middleware/auth.middleware';

const router = Router();

// Public routes (no authentication required)
// Get all users
router.get('/', userController.getAllUsers.bind(userController));

// Protected routes (authentication required)
// Sync user from Auth0
router.post('/sync', checkJwt, requireAuth, userController.syncUser.bind(userController));

// Get current user
router.get('/me', checkJwt, requireAuth, userController.getMe.bind(userController));

// Update current user
router.put('/me', checkJwt, requireAuth, userController.updateMe.bind(userController));

export default router;
