import { Router } from 'express';
import tankController from '../controllers/tank.controller';
import { checkJwt, requireAuth } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', tankController.getAllTanks.bind(tankController));
router.get('/:id', tankController.getTankById.bind(tankController));
router.get('/user/:userId', tankController.getTanksByUserId.bind(tankController));

// Protected routes (authentication required)
router.post('/', checkJwt, requireAuth, tankController.createTank.bind(tankController));
router.put('/:id', checkJwt, requireAuth, tankController.updateTank.bind(tankController));
router.delete('/:id', checkJwt, requireAuth, tankController.deleteTank.bind(tankController));

export default router;
