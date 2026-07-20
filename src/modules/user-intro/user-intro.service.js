import { userIntroRepository } from './user-intro.repository.js';

const uploadUserIntro = async (data) => {
    return await userIntroRepository.uploadUserIntro(data);
};

const getUserIntroByProfileId = async (profileId) => {
    return await userIntroRepository.getUserIntroByProfileId(profileId);
};

const getUserIntroById = async (id) => {
    return await userIntroRepository.getUserIntroById(id);
};

const updateUserIntro = async (id, data) => {
    return await userIntroRepository.updateUserIntro(id, data);
};

const deleteUserIntro = async (id) => {
    return await userIntroRepository.deleteUserIntro(id);
};

const updateUserIntroStatus = async (id, { status, reason = null }) => {
    // Check if user intro exists
    const existingIntro = await userIntroRepository.getUserIntroById(id);
    if (!existingIntro) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, "User intro not found");
    }

    const updatedUserIntro = await userIntroRepository.updateUserIntroStatus(id, { status, reason });
    return updatedUserIntro;
};

const getAllUserIntros = async (filter, query) => {
    return await userIntroRepository.getAllUserIntros(filter, query);
};

export const userIntroService = {
    uploadUserIntro,
    getUserIntroByProfileId,
    getUserIntroById,
    updateUserIntro,
    deleteUserIntro,
    updateUserIntroStatus,
    getAllUserIntros
};
