const { HANDLE_CONSTANTS } = require("../constant/constants");

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || res.statusCode || 500;
    res.status(statusCode).json({
        title: err.title || getTitleFromCode(statusCode),
        message: err.message,
        stackTrace: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    });
};

function getTitleFromCode(code) {
    switch (code) {
        case HANDLE_CONSTANTS.VALIDATION_ERROR: return "Validation Failed";
        case HANDLE_CONSTANTS.NOT_FOUND: return "Not Found";
        case HANDLE_CONSTANTS.UANUTHORIZED: return "Unauthorized";
        case HANDLE_CONSTANTS.FORBIDDEN: return "Forbidden";
        case HANDLE_CONSTANTS.SERVER_ERROR: return "Server Error";
        default: return "Unexpected Error";
    }
}

module.exports = errorHandler;