import { successStoryService } from './success-story.service.js';
import { ApiResponse } from '../../core/utils/ApiResponse.js';
import { HTTP_STATUS } from '../../core/constants/http-status-codes.constant.js';
import { generateFileUrl } from '../../core/utils/fileUtils.js';
import { SUCCESS_STORY_IMAGE_FOLDER } from './success-story.constant.js';

const submitSuccessStory = async (req, res) => {

    let {
        profile_id,
        app_package_name,
        reason_id,
        marriage_date,
        bride_name_address,
        groom_name_address,
        gift_delivery_address,
        mobile_number
    } = req.body;

    const existingSuccessStory = await successStoryService.getSuccessStoryByProfileId(profile_id);
    if (existingSuccessStory) {
        return res.status(HTTP_STATUS.CONFLICT).json(new ApiResponse(HTTP_STATUS.CONFLICT, null, 'Success story already exists for this profile.'));
    }

    if (!req.file) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json(new ApiResponse(HTTP_STATUS.BAD_REQUEST, null, 'Marriage photo not uploaded.'));
    }

    let marriage_photo = generateFileUrl(req, SUCCESS_STORY_IMAGE_FOLDER, req.file.filename);

    const result = await successStoryService.submitSuccessStory({
        profile_id,
        app_package_name,
        reason_id,
        marriage_date,
        bride_name_address,
        groom_name_address,
        gift_delivery_address,
        mobile_number,
        marriage_photo
    });

    return res.status(HTTP_STATUS.CREATED).json(
        new ApiResponse(HTTP_STATUS.CREATED, result, 'Success story submitted successfully.')
    );
};

const getAllSuccessStories = async (req, res) => {
    const page = parseInt(req.query.page) || undefined;
    const limit = parseInt(req.query.limit) || undefined;
    const status = req.query.status;

    const query = {
        pagination: page && limit ? { page, limit } : undefined,
        sort: (req.query.sortBy || req.query.sortOrder) ? {
            sortBy: req.query.sortBy,
            sortOrder: req.query.sortOrder
        } : undefined
    };

    const filters = {};
    if (status) filters.status = status;
    if (req.query.search) filters.search = req.query.search;

    const result = await successStoryService.getAllSuccessStories(filters, query);

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, result, 'Success stories fetched successfully')
    );
};

const getSuccessStoryByProfileId = async (req, res) => {
    const { profileId } = req.params;

    const result = await successStoryService.getSuccessStoryByProfileId(profileId);

    if (!result) {
        return res.status(HTTP_STATUS.NOT_FOUND).json(
            new ApiResponse(HTTP_STATUS.NOT_FOUND, null, 'Success story not found')
        );
    }

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, result, 'Success story fetched successfully')
    );
};

const updateSuccessStoryStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const existingSuccessStory = await successStoryService.getSuccessStoryById(id);
    if (!existingSuccessStory) {
        return res.status(HTTP_STATUS.NOT_FOUND).json(new ApiResponse(HTTP_STATUS.NOT_FOUND, null, 'Success story not found'));
    }

    const result = await successStoryService.updateSuccessStoryStatus(id, status);

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, result, 'Success story status updated successfully')
    );
};

export const successStoryController = {
    submitSuccessStory,
    getAllSuccessStories,
    getSuccessStoryByProfileId,
    updateSuccessStoryStatus
};
