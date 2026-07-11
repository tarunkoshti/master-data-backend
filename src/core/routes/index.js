import express from 'express';
import { authRoutes } from '../../modules/auth/index.js';
import { authHandler } from '../middlewares/authenticate.js';
import { masterDataRoutes } from '../../modules/master-data/index.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/master-data', authHandler, masterDataRoutes);

export default router;