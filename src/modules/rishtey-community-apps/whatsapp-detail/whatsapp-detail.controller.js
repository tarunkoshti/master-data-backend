import { HTTP_STATUS } from "../../../core/constants/http-status-codes.constant.js";
import { ApiResponse } from "../../../core/utils/ApiResponse.js";
import { whatsappDetailService } from "./whatsapp-detail.service.js";

const addWhatsappDetail = async (req, res) => {

    let {
        name,
        whatsapp_number,
        religion,
        caste,
    } = req.body;

    await whatsappDetailService.addWhatsappDetail({
        name,
        whatsapp_number,
        religion,
        caste,
    });

    return res.status(HTTP_STATUS.CREATED).json(
        new ApiResponse(HTTP_STATUS.CREATED, undefined, 'Whatsapp detail added successfully.')
    );
};

export const whatsappDetailController = {
    addWhatsappDetail
};