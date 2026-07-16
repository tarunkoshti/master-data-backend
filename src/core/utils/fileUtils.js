import fs from 'fs';

export const generateFileUrl = (req, folderName, fileName) => {
    return `${req.protocol}://${req.get('host')}/uploads/${folderName}/${fileName}`;
};

export const deleteFile = (filePath) => {
    if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};
