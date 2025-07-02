class AppError extends Error {
    constructor(message, statusCode, title = null) {
        super(message);
        this.statusCode = statusCode;
        this.title = title;
    }
}

module.exports = AppError;