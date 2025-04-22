const mongoose = require("mongoose");

const loginSessionScheme = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        reuqired: true,
        ref: "USER_API",
    },
    username: {
        type: String,
    },
    user_id: {
        type: String,
    },
    login_id: {
        type: String,
    },
    ip: {
        type: String,
    },
    location: {
        type: String,
    },
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("LTR_LOGIN_SESSION", loginSessionScheme);