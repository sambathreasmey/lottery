const mongoose = require("mongoose");

const userAPISchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please add the username"],
    },
    email: {
        type: String,
        required: [true, "Please add the user email address"],
    },
    password: {
        type: String,
        required: [true, "Please add the user password"],
    },
}, {
    timestamps: true,
}
);

module.exports = mongoose.model("USER_API", userAPISchema);