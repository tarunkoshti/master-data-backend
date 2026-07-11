import { ApiError } from '../../core/utils/ApiError.js';
import { masterDatasRepository } from './master-data.repository.js';

const getAllMasterData = async (filter) => {
    return await masterDatasRepository.getAllMasterData(filter);
};

const createMasterData = async (data) => {
    data.category = data.category.toLowerCase();
    data.type = data.type.toLowerCase();
    data.value = data.value.toLowerCase();
    return await masterDatasRepository.createMasterData(data);
};

const updateMasterDataById = async (id, data) => {
    const existing = await masterDatasRepository.getMasterDataById(id);
    if (!existing) {
        throw new ApiError(404, 'Master data not found');
    }
    data.category = data.category.toLowerCase();
    data.type = data.type.toLowerCase();
    data.value = data.value.toLowerCase();
    return await masterDatasRepository.updateMasterDataById(id, data);
};

const deleteMasterDataById = async (id) => {
    const existing = await masterDatasRepository.getMasterDataById(id);
    if (!existing) {
        throw new ApiError(404, 'Master data not found');
    }

    const children = await masterDatasRepository.getChildrenByParentId(id);
    if (children && children.length > 0) {
        throw new ApiError(400, 'Cannot delete master data that has associated child items');
    }

    await masterDatasRepository.deleteMasterDataById(id);
    return true;
};

const updateMasterDataStatusById = async (id, is_active) => {
    const existing = await masterDatasRepository.getMasterDataById(id);
    if (!existing) {
        throw new ApiError(404, 'Master data not found');
    }

    const status = Number(is_active);
    return await masterDatasRepository.updateMasterDataStatusById(id, status);
};

const reorderMasterData = async (type, ids) => {
    const existingItems = await masterDatasRepository.getItemsByType(type);
    const existingIds = existingItems.map(item => item.id);
    const existingIdSet = new Set(existingIds);

    if (existingIds.length !== ids.length) {
        throw new ApiError(400, `You must provide all ${existingIds.length} IDs for the type '${type}' to reorder them.`);
    }

    const uniqueProvidedIds = new Set(ids);
    if (uniqueProvidedIds.size !== ids.length) {
        throw new ApiError(400, 'Duplicate IDs provided. Each ID must be unique.');
    }

    const isValid = ids.every(id => existingIdSet.has(id));

    if (!isValid) {
        throw new ApiError(400, `One or more IDs provided do not belong to the type '${type}'.`);
    }

    await masterDatasRepository.reorderMasterData(ids);
    return true;
};

const getMasterDataByCategory = async (filter) => {
    return await masterDatasRepository.getMasterDataByCategory(filter);
};

const getMasterDataByParentId = async (filter) => {
    return await masterDatasRepository.getMasterDataByParentId(filter);
};

export const masterDataService = {
    getAllMasterData,
    createMasterData,
    updateMasterDataById,
    deleteMasterDataById,
    updateMasterDataStatusById,
    reorderMasterData,
    getMasterDataByCategory,
    getMasterDataByParentId,
};
