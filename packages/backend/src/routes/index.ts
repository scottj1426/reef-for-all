import { Router } from 'express';
import userRoutes from './user.routes';
import tankRoutes from './tank.routes';

const router = Router();

// Mount routes
router.use('/users', userRoutes);
router.use('/tanks', tankRoutes);

export default router;
