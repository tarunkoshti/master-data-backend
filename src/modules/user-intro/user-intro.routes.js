import express from 'express';
import asyncHandler from '../../core/utils/asyncHandler.js';
import { userIntroController } from './user-intro.controller.js';
import { validate } from '../../core/middlewares/validate.js';
import { createVideoUploader } from '../../core/middlewares/multerUpload.js';
import { USER_INTRO_VIDEOS_FOLDER } from './user-intro.constant.js';
import {
    uploadIntroSchema,
    getIntroSchema,
    updateIntroSchema,
    deleteIntroSchema,
    updateStatusSchema
} from './user-intro.schema.js';
import { authHandler } from '../../core/middlewares/authenticate.js';

const router = express.Router();
const userIntroVideoUpload = createVideoUploader(USER_INTRO_VIDEOS_FOLDER);

router.use(authHandler);

router.post('/upload', userIntroVideoUpload.single('video_file'), validate(uploadIntroSchema), asyncHandler(userIntroController.uploadUserIntro));
router.get('/', asyncHandler(userIntroController.getAllUserIntros));
router.get('/:profileId', validate(getIntroSchema), asyncHandler(userIntroController.getUserIntroByProfileId));
router.put('/:id', userIntroVideoUpload.single('video_file'), validate(updateIntroSchema), asyncHandler(userIntroController.updateUserIntro));
router.delete('/:id', validate(deleteIntroSchema), asyncHandler(userIntroController.deleteUserIntro));
router.patch('/status/:id', validate(updateStatusSchema), asyncHandler(userIntroController.updateUserIntroStatus));

export default router;
