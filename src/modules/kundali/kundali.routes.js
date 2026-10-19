import express from 'express';
import asyncHandler from '../../core/utils/asyncHandler.js';
import { kundaliController } from './kundali.controller.js';
import { authHandler } from '../../core/middlewares/authenticate.js';
import { validate } from '../../core/middlewares/validate.js';
import { createKundaliSchema } from './kundali.schema.js';

const router = express.Router();

// router.use(authHandler);

router.get('/', asyncHandler(kundaliController.getKundali));
router.post('/generate-basic-kundali', validate(createKundaliSchema), asyncHandler(kundaliController.generateBasicKundali));
router.post('/generate-complete-kundali', validate(createKundaliSchema), asyncHandler(kundaliController.generateCompleteKundali));

export default router;
