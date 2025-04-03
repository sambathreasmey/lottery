const mongoose = require("mongoose");

const numberDetailsScheme = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        reuqired: true,
        ref: "USER_API",
    },
    type: {
        type: String,
        // required: [true, "The post_name is required!"],
    },
    
    // Lottery number field
    // post_name: {
    //     type: String,
    //     // required: [true, "The post_name is required!"],
    // },
    // post_type: {
    //     type: String,
    //     // required: [true, "The post_type is required!"],
    // },
    // admin_name: {
    //     type: String,
    //     // required: [true, "The admin_name is required!"],
        
    // },
    // group_id: {
    //     type: String,
    //     // required: [true, "The group_id is required!"],
    // },
    // date: {
    //     type: Date,
    //     // required: [true, "The date is required!"],
    // },
    // lottery_number: {
    //     type: Number,
    //     // required: [true, "The lottery_number is required!"],
    // },
    // lottery_amount : {
    //     type: Number,
    //     // required: [true, "The lottery_amount is required!"],
    // },
    // lottery_curency : {
    //     type: String,
    //     // required: [true, "The lottery_curency is required!"],
    // },
    // paper : {
    //     type: Number,
    //     // required: [true, "The paper is required!"],
    // },
    // part : {
    //     type: Number,
    //     // required: [true, "The part is required!"],
    // },
    // line : {
    //     type: Number,
    //     // required: [true, "The line is required!"],
    // },

    page_no: { type: Number },
    date: { type: String },
    time: { type: String },
    group: { type: String },
    column_no: { type: Number },
    number: { type: Number },
    amount: { type: Number },
    currency: { type: String },
    post: { type: String },
    schedule: { type: String },

    // Lottery result field
    row_id: {
        type: String,
    },
    result_post_name: {
        type: String,
    },
    result_post_type: {
        type: String,
    },
    result_date: {
        type: Date,
    },
    result_lottery_2number: {
        type: Number,
    },
    result_lottery_3number: {
        type: Number,
    },
    result_lottery_4number: {
        type: Number,
    },

    // Lottery compare
    check_amount: { type: Number },
    check_id: { type: String },
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("LTR_NUMBER_DETAILS", numberDetailsScheme);