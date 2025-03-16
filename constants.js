const HANDLE_CONSTANTS = {
    VALIDATION_ERROR: 400,
    UANUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
};

const CODE = {
    SUCCESS: 0,
    FAILED: -1,
    GENERAL_EXCEPTION: 500,
    REQUIRE: 400,
    CREDENTIAL: 403,
    NOT_FOUND: 404,
};

const MESSAGE = {
    SUCCESS: "success",
    FAILED: "FAILED",
    GENERAL_EXCEPTION: "internal server error !",
    REQUIRE: "all fields are mandatory !",
    CREDENTIAL: "user don't have permission to update other data !",
    NOT_FOUND: "not found !",
    INSERTED: "inserted success",
    UPDATED: "updated success",
    DELETED: "deleted success",
    LOGINED: "login success",
    INVALID_LOGIN: "Email or password is not valid !",
};

const LOTTERY_TYPE = {
    LOTTERY_NUMBER: "LOTTERY_NUMBER",
    LOTTERY_RESULT: "LOTTERY_RESULT",
    LOTTERY_COMPARE: "LOTTERY_COMPARE",
};

const POST_TYPE = {
    POST_CATEGORY: "POST_CATEGORY",
    POST_SUB_CATEGORY: "POST_SUB_CATEGORY",
};

const SHORTCUT_TYPE = {
    POST: "POST",
    SCHEDULE: "SCHEDULE",
}
module.exports = {HANDLE_CONSTANTS, CODE, MESSAGE, LOTTERY_TYPE, POST_TYPE, SHORTCUT_TYPE};