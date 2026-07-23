import express from 'express';
import { successStoryController } from './success-story.controller.js';
import asyncHandler from '../../core/utils/asyncHandler.js';
import { authHandler } from '../../core/middlewares/authenticate.js';
import { createImageUploader } from '../../core/middlewares/multerUpload.js';
import { submitSuccessStorySchema, updateSuccessStoryStatusSchema, getSuccessStorySchema } from './success-story.schema.js';
import { validate } from '../../core/middlewares/validate.js';
import { SUCCESS_STORY_IMAGE_FOLDER } from './success-story.constant.js';

const router = express.Router();

const imageUpload = createImageUploader(SUCCESS_STORY_IMAGE_FOLDER);

router.post('/', imageUpload.single('marriage_photo'), validate(submitSuccessStorySchema), asyncHandler(successStoryController.submitSuccessStory));
router.get('/', authHandler, asyncHandler(successStoryController.getAllSuccessStories));
router.get('/export', authHandler, asyncHandler(successStoryController.exportSuccessStories));
router.get('/:profileId', authHandler, validate(getSuccessStorySchema), asyncHandler(successStoryController.getSuccessStoryByProfileId));
router.patch('/status/:id', authHandler, validate(updateSuccessStoryStatusSchema), asyncHandler(successStoryController.updateSuccessStoryStatus));

export default router;
