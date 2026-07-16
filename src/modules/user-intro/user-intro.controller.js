import { ApiResponse } from "../../core/utils/ApiResponse.js";
import { userIntroService } from "./user-intro.service.js";
import { USER_INTRO_VIDEOS_FOLDER } from "./user-intro.constant.js";
import { generateFileUrl, deleteFile } from "../../core/utils/fileUtils.js";
import { getVideoDuration, compressVideo } from '../../core/utils/videoUtils.js';

const uploadUserIntro = async (req, res) => {
    const { profile_id, app_id } = req.body;
    const video_file = req.file;

    const existingIntro = await userIntroService.getUserIntroByProfileId(profile_id);
    if (existingIntro) {
        return res.status(309).json(new ApiResponse(309, null, 'User intro already exists for this profile'));
    }

    if (!video_file) {
        return res.status(300).json(new ApiResponse(300, null, 'Video not uploaded'));
    }

    try {
        const duration = await getVideoDuration(video_file.path);
        if (duration >= 30) {
            deleteFile(video_file.path);
            return res.status(300).json(new ApiResponse(300, null, 'Video duration cannot exceed 30 seconds'));
        }
        // Compress the video
        await compressVideo(video_file.path);

    } catch (error) {
        deleteFile(video_file.path);
        return res.status(300).json(new ApiResponse(300, null, 'Invalid video file or error processing video'));
    }

    let video_url_link = generateFileUrl(req, USER_INTRO_VIDEOS_FOLDER, video_file.filename);

    const result = await userIntroService.uploadUserIntro({ profile_id, app_id, video_url_link });

    return res.status(201).json(
        new ApiResponse(201, result, 'User intro uploaded successfully')
    );
};

const getUserIntroByProfileId = async (req, res) => {
    const { profileId } = req.params;

    const result = await userIntroService.getUserIntroByProfileId(profileId);

    if (!result) {
        return res.status(304).json(
            new ApiResponse(304, null, 'User intro not found')
        );
    }

    return res.status(200).json(
        new ApiResponse(200, result, 'User intro fetched successfully')
    );
};

const updateUserIntro = async (req, res) => {
    const { id } = req.params;
    const video_file = req.file;

    const existingIntro = await userIntroService.getUserIntroById(id);
    if (!existingIntro) {
        return res.status(304).json(new ApiResponse(304, null, 'User intro not found'));
    }

    if (!video_file) {
        return res.status(300).json(new ApiResponse(300, null, 'Video not uploaded for update'));
    }

    try {
        const duration = await getVideoDuration(video_file.path);
        if (duration >= 30) {
            deleteFile(video_file.path);
            return res.status(300).json(new ApiResponse(300, null, 'Video duration cannot exceed 30 seconds'));
        }

        // Compress the video
        await compressVideo(video_file.path);
    } catch (error) {
        deleteFile(video_file.path);
        return res.status(300).json(new ApiResponse(300, null, 'Invalid video file or error processing video'));
    }

    const updateData = {
        video_url_link: generateFileUrl(req, USER_INTRO_VIDEOS_FOLDER, video_file.filename)
    };

    const result = await userIntroService.updateUserIntro(id, updateData);

    return res.status(200).json(
        new ApiResponse(200, result, 'User intro updated successfully')
    );
};

const deleteUserIntro = async (req, res) => {
    const { id } = req.params;

    const existingIntro = await userIntroService.getUserIntroById(id);
    if (!existingIntro) {
        return res.status(304).json(new ApiResponse(304, null, 'User intro not found'));
    }

    await userIntroService.deleteUserIntro(id);

    return res.status(200).json(
        new ApiResponse(200, null, 'User intro deleted successfully')
    );
};

export const userIntroController = {
    uploadUserIntro,
    getUserIntroByProfileId,
    updateUserIntro,
    deleteUserIntro,
};
