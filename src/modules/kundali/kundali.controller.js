import { ApiResponse } from "../../core/utils/ApiResponse.js";
import { kundaliService } from "./kundali.service.js";
import { HTTP_STATUS } from "../../core/constants/http-status-codes.constant.js";

const getKundali = async (req, res) => {
    const { profile_id, type } = req.query;
    const result = await kundaliService.getKundali({ profile_id, type });
    return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result, 'Kundali fetched successfully'));
};

const generateBasicKundali = async (req, res) => {
    await kundaliService.generateBasicKundali(req.body);
    return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, undefined, 'Basic Kundali generated successfully'));
};

const generateCompleteKundali = async (req, res) => {
    await kundaliService.generateCompleteKundali(req.body);
    return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, undefined, 'Complete Kundali generated successfully'));
};

export const kundaliController = {
    generateBasicKundali,
    generateCompleteKundali,
    getKundali
};
