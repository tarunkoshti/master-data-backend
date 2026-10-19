import express from 'express';
import { authRoutes } from '../../modules/auth/index.js';
import { masterDataRoutes } from '../../modules/master-data/index.js';
import { userIntroRoutes } from '../../modules/user-intro/index.js';
import { successStoryRoutes } from '../../modules/success-story/index.js';
import { kundaliRoutes } from '../../modules/kundali/index.js';
import { compatibilityRoutes } from '../../modules/compatibility/index.js';
import whatsappDetailRoutes from '../../modules/rishtey-community-apps/whatsapp-detail/whatsapp-detail.routes.js';

const router = express.Router();

// master admin
router.use('/auth', authRoutes);
router.use('/master-data', masterDataRoutes);
router.use('/user-intro', userIntroRoutes);
router.use('/success-story', successStoryRoutes);
router.use('/kundali', kundaliRoutes);
router.use('/compatibility', compatibilityRoutes);

// rishtey community apps
router.use('/whatsapp-detail', whatsappDetailRoutes);

export default router;