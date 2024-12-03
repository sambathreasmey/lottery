const mongoose = require("mongoose");

const memberGroupScheme = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        reuqired: true,
        ref: "USER_API",
    },
    real_name: {
        type: String,
        required: [true, "The real_name is required!"],
    },
    nick_name: {
        type: String,
        required: [true, "The nick_name is required!"],
    },
    phone: {
        type: String,
        required: [true, "The phone is required!"],
        
    },
    lottery_type: {
        type: String,
        required: [true, "The lottery_type is required!"],
    },
    multi_x2: {
        type: Number,
        required: [true, "The multi_x2 is required!"],
    },
    multi_x3: {
        type: Number,
        required: [true, "The multi_x3 is required!"],
    },
    pay_x2 : {
        type: Number,
        required: [true, "The pay_x2 is required!"],
    },
    pay_x3 : {
        type: Number,
        required: [true, "The pay_x3 is required!"],
    },
    pay_x4 : {
        type: Number,
        required: [true, "The pay_x4 is required!"],
    },
    pay_x5 : {
        type: Number,
        required: [true, "The pay_x5 is required!"],
    },
    percentage : {
        type: Number,
        required: [true, "The percentage is required!"],
    },
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("LTR_MEMBER_GROUP", memberGroupScheme);