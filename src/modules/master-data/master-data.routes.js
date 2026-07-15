import express from 'express';
import asyncHandler from '../../core/utils/asyncHandler.js';
import { masterDataController } from './master-data.controller.js';
import { authHandler } from '../../core/middlewares/authenticate.js';
import { validate } from '../../core/middlewares/validate.js';
import {
    getAllSchema,
    createSchema,
    updateSchema,
    deleteSchema
} from './master-data.schema.js';

const router = express.Router();

router.use(authHandler);

router.get('/', validate(getAllSchema), asyncHandler(masterDataController.getAllMasterData));
router.post('/', validate(createSchema), asyncHandler(masterDataController.createMasterData));
router.put('/:id', validate(updateSchema), asyncHandler(masterDataController.updateMasterDataById));
// router.delete('/:id', validate(deleteSchema), asyncHandler(masterDataController.deleteMasterDataById));

export default router;
