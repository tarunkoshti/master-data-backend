import express from 'express';
import { authRoutes } from '../../modules/auth/index.js';
import { authHandler } from '../middlewares/authenticate.js';
import { masterDataRoutes } from '../../modules/master-data/index.js';
import { userIntroRoutes } from '../../modules/user-intro/index.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/master-data', masterDataRoutes);
router.use('/user-intro', userIntroRoutes);

export default router;