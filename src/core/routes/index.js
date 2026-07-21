import express from 'express';
import { authRoutes } from '../../modules/auth/index.js';
import { masterDataRoutes } from '../../modules/master-data/index.js';
import { userIntroRoutes } from '../../modules/user-intro/index.js';
import { successStoryRoutes } from '../../modules/success-story/index.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/master-data', masterDataRoutes);
router.use('/user-intro', userIntroRoutes);
router.use('/success-story', successStoryRoutes);

export default router;