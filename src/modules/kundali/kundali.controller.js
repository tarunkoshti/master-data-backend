import { ApiResponse } from "../../core/utils/ApiResponse.js";
import { kundaliService } from "./kundali.service.js";
import { HTTP_STATUS } from "../../core/constants/http-status-codes.constant.js";

const getKundali = async (req, res) => {
    const { profile_id, app_package_name, type } = req.query;
    const result = await kundaliService.getKundali({ profile_id, app_package_name, type });
    return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result, 'Kundali fetched successfully'));
};

// const generateAndSaveBasicKundali = async (req, res) => {
//     await kundaliService.generateAndSaveBasicKundali(req.body);
//     return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, undefined, 'Basic Kundali generated successfully'));
// };

const generateAndSaveCompleteKundali = async (req, res) => {
    await kundaliService.generateAndSaveCompleteKundali(req.body);
    return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, undefined, 'Complete Kundali generated successfully'));
};

export const kundaliController = {
    // generateAndSaveBasicKundali,
    generateAndSaveCompleteKundali,
    getKundali
};
