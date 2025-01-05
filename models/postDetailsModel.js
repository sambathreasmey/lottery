const mongoose = require("mongoose");

const postDetailsScheme = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        reuqired: true,
        ref: "USER_API",
    },
    type: {
        type: String,
    },
    post_category: {
        type: String,
    },
    post_category_id: {
        type: String,
    },
    post_name: {
        type: String,
    },
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("LTR_POST_DETAILS", postDetailsScheme);