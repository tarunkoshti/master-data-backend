import { ApiResponse } from "../../core/utils/ApiResponse.js";
import { masterDataService } from "./master-data.service.js";
import { ApiError } from "../../core/utils/ApiError.js";

const getAllMasterData = async (req, res) => {
    const { is_active } = req.query;
    const filter = {};
    if (is_active !== undefined) filter.is_active = is_active;

    const result = await masterDataService.getAllMasterData(filter);

    if (result.length === 0) {
        throw new ApiError(404, 'No master data not found');
    }

    return res.status(200).json(
        new ApiResponse(200, result, 'All Master data fetched successfully')
    );
};

const createMasterData = async (req, res) => {
    const { category, type, value, name, parent_id } = req.body;

    const result = await masterDataService.createMasterData({ category, type, value, name, parent_id });

    return res.status(201).json(
        new ApiResponse(201, result, 'Master data created successfully')
    );
};

const updateMasterDataById = async (req, res) => {
    const { id } = req.params;
    const { category, type, value, name, parent_id } = req.body;

    const result = await masterDataService.updateMasterDataById(id, { category, type, value, name, parent_id });

    return res.status(200).json(
        new ApiResponse(200, result, 'Master data updated successfully')
    );
};

const deleteMasterDataById = async (req, res) => {
    const { id } = req.params;

    await masterDataService.deleteMasterDataById(id);

    return res.status(200).json(
        new ApiResponse(200, null, 'Master data deleted successfully')
    );
};

const updateMasterDataStatusById = async (req, res) => {
    const { id } = req.params;
    const { is_active } = req.body;

    const result = await masterDataService.updateMasterDataStatusById(id, is_active);

    return res.status(200).json(
        new ApiResponse(200, result, 'Master data status updated successfully')
    );
};

const reorderMasterData = async (req, res) => {
    const { type } = req.params;
    const { ids } = req.body;

    await masterDataService.reorderMasterData(type, ids);

    return res.status(200).json(
        new ApiResponse(200, null, 'Master data reordered successfully')
    );
};

const getMasterDataByCategory = async (req, res) => {
    const { category } = req.params;
    const { is_active } = req.query;

    const filter = {
        category
    };
    if (is_active !== undefined) filter.is_active = is_active;

    const result = await masterDataService.getMasterDataByCategory(filter);

    if (result.length === 0) {
        throw new ApiError(404, 'No master data found for this category');
    }

    return res.status(200).json(
        new ApiResponse(200, result, 'Master data fetched successfully')
    );
};

const getMasterDataByParentId = async (req, res) => {
    const { parent_id } = req.params;
    const { is_active } = req.query;

    const filter = {
        parent_id
    };
    if (is_active !== undefined) filter.is_active = is_active;

    const result = await masterDataService.getMasterDataByParentId(filter);

    if (result.length === 0) {
        throw new ApiError(404, 'No master data found for this parent ID');
    }

    return res.status(200).json(
        new ApiResponse(200, result, 'Master data fetched successfully')
    );
};

export const masterDataController = {
    getAllMasterData,
    createMasterData,
    updateMasterDataById,
    deleteMasterDataById,
    updateMasterDataStatusById,
    reorderMasterData,
    getMasterDataByCategory,
    getMasterDataByParentId,
};
