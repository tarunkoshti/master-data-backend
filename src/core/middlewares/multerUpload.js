import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { uploadDir } from '../../config/base.js';

export const createUploader = ({ maxSizeMB, maxFiles, allowedMimeTypes, uploadPath }) => {
    const storage = multer.diskStorage({
        destination: async (req, file, cb) => {
            try {
                // Create the destination directory if it doesn't exist
                await fs.promises.mkdir(uploadPath, { recursive: true });
                cb(null, uploadPath);
            } catch (error) {
                cb(error);
            }
        },
        filename: (req, file, cb) => {
            const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
            cb(null, uniqueName);
        }
    });

    return multer({
        storage,
        limits: {
            fileSize: maxSizeMB * 1024 * 1024,
            files: maxFiles,
        },
        fileFilter: (req, file, cb) => {
            if (!allowedMimeTypes.includes(file.mimetype)) {
                return cb(new ApiError("File type not allowed", 400));
            }
            cb(null, true);
        },
    });
};


export const ALLOWED_IMAGE_MIME_TYPES = [
    'image/jpg',
    'image/jpeg',
    'image/png',
    'image/webp',
];

export const ALLOWED_DOCUMENT_MIME_TYPES = [
    'application/pdf',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

export const ALLOWED_VIDEO_MIME_TYPES = [
    'video/mp4',
];

const UPLOADS_DIR = uploadDir;

export const createImageUploader = (folderName = 'images') => createUploader({
    maxSizeMB: 5,
    maxFiles: 1,
    allowedMimeTypes: ALLOWED_IMAGE_MIME_TYPES,
    uploadPath: path.join(UPLOADS_DIR, folderName),
});

export const createDocumentUploader = (folderName = 'documents') => createUploader({
    maxSizeMB: 5,
    maxFiles: 1,
    allowedMimeTypes: ALLOWED_DOCUMENT_MIME_TYPES,
    uploadPath: path.join(UPLOADS_DIR, folderName),
});

export const createVideoUploader = (folderName = 'videos') => createUploader({
    maxSizeMB: 50,
    maxFiles: 1,
    allowedMimeTypes: ALLOWED_VIDEO_MIME_TYPES,
    uploadPath: path.join(UPLOADS_DIR, folderName),
});

export const imageUpload = createImageUploader();
export const documentUpload = createDocumentUploader();
export const videoUpload = createVideoUploader();
