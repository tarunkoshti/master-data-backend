import { ApiResponse } from "../../core/utils/ApiResponse.js";
import { compatibilityService } from "./compatibility.service.js";
import { HTTP_STATUS } from "../../core/constants/http-status-codes.constant.js";

// const calculateAshtakootCompatibility = async (req, res) => {
//     const { app_package_name, bride, groom } = req.body;
//     const result = await compatibilityService.calculateAshtakootCompatibility({ app_package_name, bride, groom });
//     return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result, 'Ashtakoot compatibility calculated successfully'));
// };
const calculateDetailedAshtakootCompatibility = async (req, res) => {
    const { app_package_name, bride, groom } = req.body;
    const result = await compatibilityService.calculateDetailedAshtakootCompatibility({ app_package_name, bride, groom });
    return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result, 'Detailed Ashtakoot compatibility calculated successfully'));
};
const calculateManglikCompatibility = async (req, res) => {
    const { app_package_name, bride, groom } = req.body;
    const result = await compatibilityService.calculateManglikCompatibility({ app_package_name, bride, groom });
    return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result, 'Manglik compatibility calculated successfully'));
};

export const compatibilityController = {
    // calculateAshtakootCompatibility,
    calculateDetailedAshtakootCompatibility,
    calculateManglikCompatibility
};
