const mongoose = require("mongoose");

const shortcutDetialSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "USER_API",
    },
    val: {
        type: String,
    },
    key: {
        type: String,
    },
    // actions: {
    //     type: String,
    // },
    type: {
        type: String,
    },
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("LTR_SHORTCUT_DETAILS", shortcutDetialSchema);