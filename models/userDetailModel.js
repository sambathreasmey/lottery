const mongoose = require("mongoose");

const userDetailSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "USER_API",
    },
    username: {
        type: String,
        required: [true, "Please add the name"],
    },
    phone_number: {
        type: String,
        required: [true, "Please add the phone number"],
    },
    email_address: {
        type: String,
        required: [true, "Please add the phone number"],
    },
    password: {
        type: String,
        required: [true, "Please add the phone number"],
    },
    address: {
        type: String,
        required: [true, "Please add the phone number"],
    },
    role: {
        type: Number,
    },
    status: {
        type: Number,
    },
    // privilege: {
    //     type: String,
    //     required: [true, "Please add the phone number"],
    // },
    // attemp: {
    //     type: Number,
    //     required: [true, "Please add the phone number"],
    // },
    // user_otp: {
    //     type: Number,
    //     required: [true, "Please add the phone number"],
    // },
    // group_id: {
    //     type: String,
    //     required: [true, "Please add the phone number"],
    // },
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("LTR_USER_DETAILS", userDetailSchema);