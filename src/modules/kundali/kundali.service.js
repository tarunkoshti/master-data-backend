import { kundaliRepository } from './kundali.repository.js';
import { checkMangalDosha, generateBasicKundali, generateCompleteKundali } from '../../clients/navamsha.client.js';
import { ApiError } from '../../core/utils/ApiError.js';
import { HTTP_STATUS } from '../../core/constants/http-status-codes.constant.js';
import { KUNDALI_DEFAULT_SETTINGS, KUNDALI_TYPE } from './kundali.constant.js';

const getKundali = async ({ profile_id, app_package_name, type }) => {
    const result = await kundaliRepository.getKundali({ profile_id, app_package_name, type });
    if (!result) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Kundali not found');
    result.res_json = JSON.parse(result?.res_json);
    if (result?.res_json_mangal_dosha) {
        result.res_json_mangal_dosha = JSON.parse(result.res_json_mangal_dosha);
    }
    return result;
};

const generateAndSaveBasicKundali = async (data) => {
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
        ayanamsha: settings?.ayanamsha || KUNDALI_DEFAULT_SETTINGS.ayanamsha,
        language: settings?.language || KUNDALI_DEFAULT_SETTINGS.language,
        observation_point: settings?.observation_point || KUNDALI_DEFAULT_SETTINGS.observation_point,
    };

    const { output } = await generateBasicKundali({
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

    const { output: mangalDoshaOutput } = await checkMangalDosha({
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

    const existingBasicKundali = await kundaliRepository.getKundali({
        profile_id,
        app_package_name,
        type: KUNDALI_TYPE.BASIC
    });

    if (existingBasicKundali) {
        return await kundaliRepository.updateBasicKundali({
            profile_id,
            app_package_name,
            res_json: JSON.stringify(output),
            res_json_mangal_dosha: JSON.stringify(mangalDoshaOutput),
        });
    } else {
        return kundaliRepository.saveBasicKundali({
            profile_id,
            app_package_name,
            res_json: JSON.stringify(output),
            res_json_mangal_dosha: JSON.stringify(mangalDoshaOutput),
        });
    }
};

const generateAndSaveCompleteKundali = async (data) => {
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
        ayanamsha: settings?.ayanamsha || KUNDALI_DEFAULT_SETTINGS.ayanamsha,
        language: settings?.language || KUNDALI_DEFAULT_SETTINGS.language,
        observation_point: settings?.observation_point || KUNDALI_DEFAULT_SETTINGS.observation_point,
    };

    const { output } = await generateCompleteKundali({
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

    const { output: mangalDoshaOutput } = await checkMangalDosha({
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

    const existingBasicKundali = await kundaliRepository.getKundali({
        profile_id,
        app_package_name,
        type: KUNDALI_TYPE.COMPLETE
    });

    if (existingBasicKundali) {
        return await kundaliRepository.updateCompleteKundali({
            profile_id,
            app_package_name,
            res_json: JSON.stringify(output),
            res_json_mangal_dosha: JSON.stringify(mangalDoshaOutput),
        });
    } else {
        return kundaliRepository.saveCompleteKundali({
            profile_id,
            app_package_name,
            res_json: JSON.stringify(output),
            res_json_mangal_dosha: JSON.stringify(mangalDoshaOutput),
        });
    }
};

export const kundaliService = {
    generateAndSaveBasicKundali,
    generateAndSaveCompleteKundali,
    getKundali
};
