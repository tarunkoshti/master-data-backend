import { ApiResponse } from "../../core/utils/ApiResponse.js";
import { masterDataService } from "./master-data.service.js";
import { ApiError } from "../../core/utils/ApiError.js";
import { masterDataKeyGenerator } from "../../core/cache/keys.js";
import { getStoredKey, setStoredKey, clearCachePattern } from "../../core/cache/query.js";
import { CACHE_TTL } from "../../core/cache/ttl.js";

const clearMasterDataCacheForRecord = async (record) => {
    if (record?.type) {
        await clearCachePattern(`masterData:*type:${record.type}*`);
    }
    if (record?.parent_id) {
        await clearCachePattern(`masterData:*parent_id:${record.parent_id}*`);
    }
};

const getAllMasterData = async (req, res) => {
    const filter = {};
    const { type, parent_id } = req.query;

    if (type) {
        filter.type = type;
    } else {
        throw new ApiError(400, 'type is required');
    }

    if (parent_id !== undefined) {
        filter.parent_id = parent_id;
    }

    const cacheKey = masterDataKeyGenerator(filter);
    const cached = await getStoredKey(cacheKey);
    if (cached) {
        return res.status(200).json(
            new ApiResponse(200, JSON.parse(cached), 'All Master data fetched successfully (Cached)')
        );
    }

    const result = await masterDataService.getAllMasterData(filter);

    await setStoredKey(cacheKey, result, CACHE_TTL);

    return res.status(200).json(
        new ApiResponse(200, result, 'All Master data fetched successfully')
    );
};

const createMasterData = async (req, res) => {
    const { type, name, parent_id } = req.body;
    const result = await masterDataService.createMasterData({ type, name, parent_id });

    await clearMasterDataCacheForRecord({ type, parent_id });

    return res.status(201).json(
        new ApiResponse(201, result, 'Master data created successfully')
    );
};

const updateMasterDataById = async (req, res) => {
    const { id } = req.params;
    const { type, name, parent_id } = req.body;

    const existing = await masterDataService.getMasterDataById(id, type);
    if (existing) {
        await clearMasterDataCacheForRecord({ type, parent_id: existing.parent_id });
    }

    const result = await masterDataService.updateMasterDataById(id, { type, name, parent_id });

    await clearMasterDataCacheForRecord({ type, parent_id });

    return res.status(200).json(
        new ApiResponse(200, result, 'Master data updated successfully')
    );
};

// const deleteMasterDataById = async (req, res) => {
//     const { id } = req.params;
//     const { type } = req.query;
// 
//     if (!type) {
//         throw new ApiError(400, 'type is required to delete');
//     }
// 
//     const existing = await masterDataService.getMasterDataById(id, type);
// 
//     await masterDataService.deleteMasterDataById(id, type);
// 
//     if (existing) {
//         await clearMasterDataCacheForRecord({ type, parent_id: existing.parent_id || existing.state_id || existing.country_id });
//     }
// 
//     return res.status(200).json(
//         new ApiResponse(200, null, 'Master data deleted successfully')
//     );
// };


export const masterDataController = {
    getAllMasterData,
    createMasterData,
    updateMasterDataById,
    // deleteMasterDataById,
};
