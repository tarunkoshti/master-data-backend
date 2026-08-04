import express from 'express';
import { authRoutes } from '../../modules/auth/index.js';
import { masterDataRoutes } from '../../modules/master-data/index.js';
import { userIntroRoutes } from '../../modules/user-intro/index.js';
import { successStoryRoutes } from '../../modules/success-story/index.js';
import whatsappDetailRoutes from '../../modules/rishtey-community-apps/whatsapp-detail/whatsapp-detail.routes.js';

const router = express.Router();

// master admin
router.use('/auth', authRoutes);
router.use('/master-data', masterDataRoutes);
router.use('/user-intro', userIntroRoutes);
router.use('/success-story', successStoryRoutes);

// rishtey community apps
router.use('/whatsapp-detail', whatsappDetailRoutes);

export default router;