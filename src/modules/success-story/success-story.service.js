import { successStoryRepository } from './success-story.repository.js';

const submitSuccessStory = async (data) => {

    const newStory = await successStoryRepository.createSuccessStory(data);

    return newStory;
};

const getAllSuccessStories = async (filter, query) => {
    return successStoryRepository.getAllSuccessStories(filter, query);
};

const getSuccessStoryByProfileId = async (profileId) => {
    return await successStoryRepository.getSuccessStoryByProfileId(profileId);
};

const getSuccessStoryById = async (id) => {
    return await successStoryRepository.getSuccessStoryById(id);
};

const updateSuccessStoryStatus = async (id, status) => {

    const updated = await successStoryRepository.updateSuccessStoryStatus(id, status);
    return updated;
};

export const successStoryService = {
    submitSuccessStory,
    getAllSuccessStories,
    getSuccessStoryByProfileId,
    getSuccessStoryById,
    updateSuccessStoryStatus
};
