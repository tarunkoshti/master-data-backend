import express from 'express';
import asyncHandler from '../../../core/utils/asyncHandler.js';
import { validate } from '../../../core/middlewares/validate.js';
import { whatsappDetailController } from './whatsapp-detail.controller.js';
import { whatsappDetailSchema } from './whatsapp-detail.schema.js';

const router = express.Router();

router.post('/', validate(whatsappDetailSchema), asyncHandler(whatsappDetailController.addWhatsappDetail));

export default router;
