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

export const userIntroService = {
    uploadUserIntro,
    getUserIntroByProfileId,
    getUserIntroById,
    updateUserIntro,
    deleteUserIntro,
};
