import express from 'express';
import asyncHandler from '../../core/utils/asyncHandler.js';
import { masterDataController } from './master-data.controller.js';
import { authHandler } from '../../core/middlewares/authenticate.js';
import { validate } from '../../core/middlewares/validate.js';
import {
    getAllSchema,
    createSchema,
    updateSchema,
    deleteSchema,
    updateStatusSchema,
    getByCategorySchema,
    getByParentIdSchema,
    reorderSchema
} from './master-data.schema.js';

const router = express.Router();

router.use(authHandler);

router.get('/', validate(getAllSchema), asyncHandler(masterDataController.getAllMasterData));
router.post('/', validate(createSchema), asyncHandler(masterDataController.createMasterData));
router.put('/:id', validate(updateSchema), asyncHandler(masterDataController.updateMasterDataById));
router.delete('/:id', validate(deleteSchema), asyncHandler(masterDataController.deleteMasterDataById));
router.patch('/:id/status', validate(updateStatusSchema), asyncHandler(masterDataController.updateMasterDataStatusById));
router.patch('/:type/reorder', validate(reorderSchema), asyncHandler(masterDataController.reorderMasterData));
router.get('/parent/:parent_id', validate(getByParentIdSchema), asyncHandler(masterDataController.getMasterDataByParentId));
router.get('/:category', validate(getByCategorySchema), asyncHandler(masterDataController.getMasterDataByCategory));


export default router;
