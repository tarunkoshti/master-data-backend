import { ApiError } from "../utils/ApiError.js";
import Logger from "../utils/logger.js";

function errorHandler(err, req, res, next) {
    Logger.error(err);

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json(err.toJSON());
    }

    if (err.code === 'ER_DUP_ENTRY') {
        const duplicateError = new ApiError(409, 'A record with these unique details already exists');
        return res.status(duplicateError.statusCode).json(duplicateError.toJSON());
    }

    res.status(500).json({
        status: 'error',
        statusCode: 500,
        message: err.message || 'Internal Server Error',
    });
}

export {
    errorHandler
};