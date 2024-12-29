const { HANDLE_CONSTANTS } = require("../constants");

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    switch (statusCode) {
        case HANDLE_CONSTANTS.VALIDATION_ERROR:
            res.json({
                title: "Validation Failed",
                message: err.message,
                stackTrance: err.stack,
            });
            break;
        case HANDLE_CONSTANTS.NOT_FOUND:
            res.json({
                title: "Not Found",
                message: err.message,
                stackTrance: err.stack,
            });
            break;
        case HANDLE_CONSTANTS.UANUTHORIZED:
            res.json({
                title: "Uanuthorized",
                message: err.message,
                stackTrance: err.stack,
            });
            break;
        case HANDLE_CONSTANTS.FORBIDDEN:
            res.json({
                title: "Forbidden",
                message: err.message,
                stackTrance: err.stack,
            });
            break;
        case HANDLE_CONSTANTS.SERVER_ERROR:
            res.json({
                title: "Server Error",
                message: err.message,
                stackTrance: err.stack,
            });
            break;
        default:
            console.log("No Error, All good !");
            break;
    }
};

module.exports = errorHandler;