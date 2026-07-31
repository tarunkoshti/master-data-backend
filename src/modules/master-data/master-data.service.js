import { masterDatasRepository } from './master-data.repository.js';

const getMasterDataById = async (id, type) => {
    return await masterDatasRepository.getMasterDataById(id, type);
};

const getAllMasterData = async (filter) => {
    return await masterDatasRepository.getAllMasterData(filter);
};

const getBatchMasterData = async (filter) => {
    const { types } = filter;

    const results = {};
    const promises = types.map(async (type) => {
        results[type] = await masterDatasRepository.getAllMasterData({ type });
    });

    await Promise.all(promises);
    return results;
};

const createMasterData = async (data) => {
    return await masterDatasRepository.createMasterData(data);
};

const updateMasterDataById = async (id, data) => {
    return await masterDatasRepository.updateMasterDataById(id, data);
};

// const deleteMasterDataById = async (id, type) => {
//     return await masterDatasRepository.deleteMasterDataById(id, type);
// };

export const masterDataService = {
    getMasterDataById,
    getAllMasterData,
    getBatchMasterData,
    createMasterData,
    updateMasterDataById,
    // deleteMasterDataById,
};
