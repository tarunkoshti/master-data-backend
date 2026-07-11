class ApiError extends Error {
    constructor(statusCode, message, errorCode, errors = []) {
        super(message);

        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.errors = errors;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ApiError);
        }
    }

    toJSON() {
        return {
            status: false,
            statusCode: this.statusCode,
            message: this.message,
            errorCode: this.errorCode,
            ...(this.errors.length > 0 && { errors: this.errors })
        }
    }
}

export {
    ApiError
};