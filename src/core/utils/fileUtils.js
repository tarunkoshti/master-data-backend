import fs from 'fs';
import path from 'path';
import { uploadDir } from "../../config/base.js";
import Logger from './logger.js';

export const generateFileUrl = (req, folderName, fileName) => {
    return `${req.protocol}://${req.get('host')}/uploads/${folderName}/${fileName}`;
};

export const getFilePathFromUrl = (fileUrl, folderName) => {
    if (!fileUrl) return null;
    const fileName = fileUrl.split('/').pop();
    return path.join(uploadDir, folderName, fileName);
};

export const deleteFile = async (filePath) => {
    try {
        if (filePath) {
            await fs.promises.access(filePath);
            await fs.promises.unlink(filePath);
        }
    } catch (error) {
        if (error.code !== 'ENOENT') {
            Logger.error(`Failed to delete file at ${filePath}:`, error);
        }
    }
};
