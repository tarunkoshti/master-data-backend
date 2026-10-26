import express from 'express';
import asyncHandler from '../../core/utils/asyncHandler.js';
import { compatibilityController } from './compatibility.controller.js';
import { validate } from '../../core/middlewares/validate.js';
import { authHandler } from '../../core/middlewares/authenticate.js';
import { calculateCompatibilitySchema } from './compatibility.schema.js';

const router = express.Router();

router.use(authHandler);

// router.post('/ashtakoot', validate(calculateCompatibilitySchema), asyncHandler(compatibilityController.calculateAshtakootCompatibility));
router.post('/detailed-ashtakoot', validate(calculateCompatibilitySchema), asyncHandler(compatibilityController.calculateDetailedAshtakootCompatibility));
router.post('/manglik', validate(calculateCompatibilitySchema), asyncHandler(compatibilityController.calculateManglikCompatibility));

export default router;
