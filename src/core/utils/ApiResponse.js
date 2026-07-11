class ApiResponse {
    constructor(statusCode, data, message) {
        this.message = message;
        this.statusCode = statusCode;
        this.data = data;
    }

    toJSON() {
        return {
            status: true,
            statusCode: this.statusCode,
            message: this.message,
            data: this.data
        }
    }
}

export {
    ApiResponse
};