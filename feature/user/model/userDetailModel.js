const mongoose = require("mongoose");

const userDetailSchema = mongoose.Schema({
    area_id: {
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
    agent_menu: {
        type: Number,
    },
    agent_permission: {
        type: Number,
    },
    post_time_menu: {
        type: Number,
    },
    post_time_permission: {
        type: Number,
    },
    input_lottery_menu: {
        type: Number,
    },
    input_lottery_permission: {
        type: Number,
    },
    verify_lottery_menu: {
        type: Number,
    },
    verify_lottery_permission: {
        type: Number,
    },
    result_lottery_menu: {
        type: Number,
    },
    result_lottery_permission: {
        type: Number,
    },
    sum_enter_menu: {
        type: Number,
    },
    sum_enter_permission: {
        type: Number,
    },
    win_number_menu: {
        type: Number,
    },
    win_number_permission: {
        type: Number,
    },
    user_manage_menu: {
        type: Number,
    },
    user_manage_permission: {
        type: Number,
    },
    report_menu: {
        type: Number,
    },
    report_permission: {
        type: Number,
    },
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("LTR_USER_DETAILS", userDetailSchema);