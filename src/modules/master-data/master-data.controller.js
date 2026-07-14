import { ApiResponse } from "../../core/utils/ApiResponse.js";
import { masterDataService } from "./master-data.service.js";
import { ApiError } from "../../core/utils/ApiError.js";
import { masterDataKeyGenerator } from "../../core/cache/keys.js";
import { getStoredKey, setStoredKey, clearCachePattern } from "../../core/cache/query.js";
import { CACHE_TTL } from "../../core/cache/ttl.js";

const clearMasterDataCacheForRecord = async (record) => {
    await clearCachePattern(`masterData:all`);

    if (record?.category) {
        await clearCachePattern(`masterData:*category:${record.category}*`);
    }
    if (record?.type) {
        await clearCachePattern(`masterData:*type:${record.type}*`);
    }
    if (record?.parent_id) {
        await clearCachePattern(`masterData:*parent_id:${record.parent_id}*`);
    }
};

const getAllMasterData = async (req, res) => {
    const filter = {};

    if (req.query.category) {
        filter.category = req.query.category;
    }

    if (req.query.type) {
        filter.type = req.query.type;
    }

    if (req.query.parent_id) {
        filter.parent_id = req.query.parent_id;
    }

    if (req.query.is_active !== undefined) {
        filter.is_active = req.query.is_active;
    }

    const cacheKey = masterDataKeyGenerator(filter);
    const cached = await getStoredKey(cacheKey);
    if (cached) {
        return res.status(200).json(
            new ApiResponse(200, JSON.parse(cached), 'All Master data fetched successfully (Cached)')
        );
    }

    const result = await masterDataService.getAllMasterData(filter);

    if (result.length === 0) {
        throw new ApiError(404, 'No master data not found');
    }

    await setStoredKey(cacheKey, result, CACHE_TTL);

    return res.status(200).json(
        new ApiResponse(200, result, 'All Master data fetched successfully')
    );
};

const createMasterData = async (req, res) => {
    const { category, type, value, name, parent_id } = req.body;
    const result = await masterDataService.createMasterData({ category, type, value, name, parent_id });

    await clearMasterDataCacheForRecord({ category, type, parent_id });

    return res.status(201).json(
        new ApiResponse(201, result, 'Master data created successfully')
    );
};

const updateMasterDataById = async (req, res) => {
    const { id } = req.params;

    const existing = await masterDataService.getMasterDataById(id);
    if (existing) {
        await clearMasterDataCacheForRecord(existing);
    }

    const { category, type, value, name, parent_id } = req.body;
    const result = await masterDataService.updateMasterDataById(id, { category, type, value, name, parent_id });

    await clearMasterDataCacheForRecord({ category, type, parent_id });

    return res.status(200).json(
        new ApiResponse(200, result, 'Master data updated successfully')
    );
};

const deleteMasterDataById = async (req, res) => {
    const { id } = req.params;
    const existing = await masterDataService.getMasterDataById(id);

    await masterDataService.deleteMasterDataById(id);

    if (existing) {
        await clearMasterDataCacheForRecord(existing);
    }

    return res.status(200).json(
        new ApiResponse(200, null, 'Master data deleted successfully')
    );
};

const updateMasterDataStatusById = async (req, res) => {
    const { id } = req.params;
    const existing = await masterDataService.getMasterDataById(id);

    const { is_active } = req.body;
    const result = await masterDataService.updateMasterDataStatusById(id, is_active);

    if (existing) {
        await clearMasterDataCacheForRecord(existing);
    }

    return res.status(200).json(
        new ApiResponse(200, result, 'Master data status updated successfully')
    );
};

const reorderMasterData = async (req, res) => {
    const { type } = req.params;
    const { ids } = req.body;

    let category = null;
    let parent_id = null;
    if (ids && ids.length > 0) {
        const existing = await masterDataService.getMasterDataById(ids[0]);
        if (existing) {
            category = existing.category;
            parent_id = existing.parent_id;
        }
    }

    await masterDataService.reorderMasterData(type, ids);

    await clearMasterDataCacheForRecord({ category, type, parent_id });

    return res.status(200).json(
        new ApiResponse(200, null, 'Master data reordered successfully')
    );
};

export const masterDataController = {
    getAllMasterData,
    createMasterData,
    updateMasterDataById,
    deleteMasterDataById,
    updateMasterDataStatusById,
    reorderMasterData,
};
