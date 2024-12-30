const mongoose = require("mongoose");

const userDetailSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "USER_API",
    },
    username: {
        type: String,
    },
    phone_number: {
        type: String,
    },
    email_address: {
        type: String,
    },
    password: {
        type: String,
    },
    address: {
        type: String,
    },
    role: {
        type: Number,
    },
    status: {
        type: Number,
    },
    // user privilege 
    input_lottery_menu: {
        type: Number,
    },
    input_lottery_permission: {
        type: Number,
    },
    compare_lottery_menu: {
        type: Number,
    },
    compare_lottery_permission: {
        type: Number,
    },
    result_lottery_menu: {
        type: Number,
    },
    result_lottery_permission: {
        type: Number,
    },
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("LTR_USER_DETAILS", userDetailSchema);