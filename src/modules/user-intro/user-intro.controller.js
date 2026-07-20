import { ApiResponse } from "../../core/utils/ApiResponse.js";
import { userIntroService } from "./user-intro.service.js";
import { USER_INTRO_VIDEOS_FOLDER } from "./user-intro.constant.js";
import { generateFileUrl, deleteFile, getFilePathFromUrl } from "../../core/utils/fileUtils.js";
import { getVideoDuration, compressVideo } from '../../core/utils/videoUtils.js';
import { HTTP_STATUS } from "../../core/constants/http-status-codes.constant.js";

const uploadUserIntro = async (req, res) => {
    const { profile_id, app_id } = req.body;
    const video_file = req.file;

    const existingIntro = await userIntroService.getUserIntroByProfileId(profile_id);
    if (existingIntro) {
        return res.status(HTTP_STATUS.CONFLICT).json(new ApiResponse(HTTP_STATUS.CONFLICT, null, 'User intro already exists for this profile'));
    }

    if (!video_file) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json(new ApiResponse(HTTP_STATUS.BAD_REQUEST, null, 'Video not uploaded'));
    }

    try {
        const duration = await getVideoDuration(video_file.path);
        if (duration >= 31) {
            await deleteFile(video_file.path);
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new ApiResponse(HTTP_STATUS.BAD_REQUEST, null, 'Video duration cannot exceed 30 seconds'));
        }
        // Compress the video
        await compressVideo(video_file.path);

    } catch (error) {
        await deleteFile(video_file.path);
        return res.status(HTTP_STATUS.BAD_REQUEST).json(new ApiResponse(HTTP_STATUS.BAD_REQUEST, null, 'Invalid video file or error processing video'));
    }

    let video_url_link = generateFileUrl(req, USER_INTRO_VIDEOS_FOLDER, video_file.filename);

    const result = await userIntroService.uploadUserIntro({ profile_id, app_id, video_url_link });

    return res.status(HTTP_STATUS.CREATED).json(
        new ApiResponse(HTTP_STATUS.CREATED, result, 'User intro uploaded successfully')
    );
};

const getUserIntroByProfileId = async (req, res) => {
    const { profileId } = req.params;

    const result = await userIntroService.getUserIntroByProfileId(profileId);

    if (!result) {
        return res.status(HTTP_STATUS.NOT_FOUND).json(
            new ApiResponse(HTTP_STATUS.NOT_FOUND, null, 'User intro not found')
        );
    }

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, result, 'User intro fetched successfully')
    );
};

const updateUserIntro = async (req, res) => {
    const { id } = req.params;
    const video_file = req.file;

    const existingIntro = await userIntroService.getUserIntroById(id);
    if (!existingIntro) {
        return res.status(HTTP_STATUS.NOT_FOUND).json(new ApiResponse(HTTP_STATUS.NOT_FOUND, null, 'User intro not found'));
    }

    if (!video_file) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json(new ApiResponse(HTTP_STATUS.BAD_REQUEST, null, 'Video not uploaded for update'));
    }

    try {
        const duration = await getVideoDuration(video_file.path);
        if (duration >= 31) {
            await deleteFile(video_file.path);
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new ApiResponse(HTTP_STATUS.BAD_REQUEST, null, 'Video duration cannot exceed 30 seconds'));
        }

        // Compress the video
        await compressVideo(video_file.path);
    } catch (error) {
        await deleteFile(video_file.path);
        return res.status(HTTP_STATUS.BAD_REQUEST).json(new ApiResponse(HTTP_STATUS.BAD_REQUEST, null, 'Invalid video file or error processing video'));
    }

    const updateData = {
        video_url_link: generateFileUrl(req, USER_INTRO_VIDEOS_FOLDER, video_file.filename)
    };

    const result = await userIntroService.updateUserIntro(id, updateData);

    if (existingIntro.video_url_link) {
        const oldFilePath = getFilePathFromUrl(existingIntro.video_url_link, USER_INTRO_VIDEOS_FOLDER);
        await deleteFile(oldFilePath);
    }

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, result, 'User intro updated successfully')
    );
};

const deleteUserIntro = async (req, res) => {
    const { id } = req.params;

    const existingIntro = await userIntroService.getUserIntroById(id);
    if (!existingIntro) {
        return res.status(HTTP_STATUS.NOT_FOUND).json(new ApiResponse(HTTP_STATUS.NOT_FOUND, null, 'User intro not found'));
    }

    await userIntroService.deleteUserIntro(id);

    if (existingIntro.video_url_link) {
        const oldFilePath = getFilePathFromUrl(existingIntro.video_url_link, USER_INTRO_VIDEOS_FOLDER);
        await deleteFile(oldFilePath);
    }

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, null, 'User intro deleted successfully')
    );
};

const updateUserIntroStatus = async (req, res) => {
    const { id } = req.params;
    const { status, reason } = req.body;

    const existingIntro = await userIntroService.getUserIntroById(id);
    if (!existingIntro) {
        return res.status(HTTP_STATUS.NOT_FOUND).json(new ApiResponse(HTTP_STATUS.NOT_FOUND, null, 'User intro not found'));
    }

    const result = await userIntroService.updateUserIntroStatus(id, { status, reason });

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, result, 'User intro status updated successfully')
    );
};

const getAllUserIntros = async (req, res) => {
    const page = parseInt(req.query.page) || undefined;
    const limit = parseInt(req.query.limit) || undefined;

    const query = {
        pagination: page && limit ? { page, limit } : undefined,
        sort: (req.query.sortBy || req.query.sortOrder) ? {
            sortBy: req.query.sortBy,
            sortOrder: req.query.sortOrder
        } : undefined
    };

    const result = await userIntroService.getAllUserIntros({}, query);

    return res.status(HTTP_STATUS.OK).json(
        new ApiResponse(HTTP_STATUS.OK, result, 'User intros fetched successfully')
    );
};

export const userIntroController = {
    uploadUserIntro,
    getUserIntroByProfileId,
    updateUserIntro,
    deleteUserIntro,
    updateUserIntroStatus,
    getAllUserIntros
};
