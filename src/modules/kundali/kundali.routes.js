import express from 'express';
import asyncHandler from '../../core/utils/asyncHandler.js';
import { kundaliController } from './kundali.controller.js';
import { authHandler } from '../../core/middlewares/authenticate.js';
import { validate } from '../../core/middlewares/validate.js';
import { generateKundaliSchema } from './kundali.schema.js';

const router = express.Router();

router.use(authHandler);

router.get('/', asyncHandler(kundaliController.getKundali));
router.post('/generate-basic-kundali', validate(generateKundaliSchema), asyncHandler(kundaliController.generateAndSaveBasicKundali));
router.post('/generate-complete-kundali', validate(generateKundaliSchema), asyncHandler(kundaliController.generateAndSaveCompleteKundali));

export default router;
