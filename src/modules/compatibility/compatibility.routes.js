import express from 'express';
import asyncHandler from '../../core/utils/asyncHandler.js';
import { compatibilityController } from './compatibility.controller.js';
import { validate } from '../../core/middlewares/validate.js';
import { authHandler } from '../../core/middlewares/authenticate.js';

const router = express.Router();

router.use(authHandler);

// router.post('/compatibility/ashtakoot', authHandler, validate(addAshtakootCompatibilitySchema), asyncHandler(compatibilityController.addAshtakootCompatibility));
// router.post('/compatibility/ashtakoot/detailed', authHandler, validate(addDetailedAshtakootCompatibilitySchema), asyncHandler(compatibilityController.addDetailedAshtakootCompatibility));
// router.post('/compatibility/manglik', authHandler, validate(addManglikCompatibilitySchema), asyncHandler(compatibilityController.addManglikCompatibility));

export default router;
