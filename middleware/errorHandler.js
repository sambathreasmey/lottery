const contants = require("../constants");
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    switch (statusCode) {
        case contants.VALIDATION_ERROR:
            res.json({
                title: "Validation Failed",
                message: err.message,
                stackTrance: err.stack,
            });
            break;
        case contants.NOT_FOUND:
            res.json({
                title: "Not Found",
                message: err.message,
                stackTrance: err.stack,
            });
            break;
        case contants.UANUTHORIZED:
            res.json({
                title: "Uanuthorized",
                message: err.message,
                stackTrance: err.stack,
            });
            break;
        case contants.FORBIDDEN:
            res.json({
                title: "Forbidden",
                message: err.message,
                stackTrance: err.stack,
            });
            break;
        case contants.SERVER_ERROR:
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