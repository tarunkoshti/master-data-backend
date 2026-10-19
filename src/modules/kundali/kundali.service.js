import { kundaliRepository } from './kundali.repository.js';
import { navGenerateBasicKundali, navGenerateCompleteKundali } from '../../clients/navamsha.client.js';
import { ApiError } from '../../core/utils/ApiError.js';
import { HTTP_STATUS } from '../../core/constants/http-status-codes.constant.js';

const getKundali = async ({ profile_id, type }) => {
    const result = await kundaliRepository.getKundali({ profile_id, type });
    if (!result) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Kundali not found');
    return JSON.parse(result?.res_json);
};

const generateBasicKundali = async (data) => {
    const {
        profile_id,
        app_package_name,
        date,
        month,
        year,
        hours,
        minutes,
        seconds,
        timezone,
        latitude,
        longitude,
        settings = {}
    } = data;

    const finalSettings = {
        ayanamsha: settings?.ayanamsha || "lahiri",
        language: settings?.language || "en",
        observation_point: settings?.observation_point || "topocentric",
    };

    const { output } = await navGenerateBasicKundali({
        date,
        month,
        year,
        hours,
        minutes,
        seconds,
        timezone,
        latitude,
        longitude,
        settings: finalSettings
    });

    return kundaliRepository.addBasicKundali({
        profile_id,
        app_package_name,
        res_json: JSON.stringify(output)
    });
};

const generateCompleteKundali = async (data) => {
    const {
        profile_id,
        app_package_name,
        date,
        month,
        year,
        hours,
        minutes,
        seconds,
        timezone,
        latitude,
        longitude,
        settings = {}
    } = data;

    const finalSettings = {
        ayanamsha: settings?.ayanamsha || "lahiri",
        language: settings?.language || "en",
        observation_point: settings?.observation_point || "topocentric",
    };

    const { output } = await navGenerateCompleteKundali({
        date,
        month,
        year,
        hours,
        minutes,
        seconds,
        timezone,
        latitude,
        longitude,
        settings: finalSettings
    });

    return kundaliRepository.addCompleteKundali({
        profile_id,
        app_package_name,
        res_json: JSON.stringify(output)
    });
};

export const kundaliService = {
    generateBasicKundali,
    generateCompleteKundali,
    getKundali
};
