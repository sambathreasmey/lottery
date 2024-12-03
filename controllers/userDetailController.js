const asyncHandler = require("express-async-handler");
const UserDetail = require("../models/userDetailModel");

//@desc Get all user details
//@route GET /api/user_detail
//@access private
const getUserDetail = asyncHandler(async (req, res) => {
    const userDetail = await UserDetail.find();
    res.status(200).json(userDetail);
});

//@desc Get by id user detail
//@route GET /api/user_detail
//@access private
const getUserDetailById = asyncHandler(async (req, res) => {
    try {
        const userDetail = await UserDetail.findOne({ _id: req.params.id });
        if (!userDetail) {
            res.status(404);
            throw new Error("this id is not found");
        }
        res.status(200).json(userDetail);
    } catch (error) {
        res.status(404);
        throw new Error("this id is not found");
    }
});

//@desc create user details
//@route POST /api/user_detail
//@access private
const createUserDetail = asyncHandler(async (req, res) => {
    const { username, phone_number, password, email_address, address } = req.body;
    if (!username || !phone_number || !password || !email_address || !address) {
        res.status(400);
        throw new Error("all fields are mandatory");
    }

    try {
        const userAvailable = await UserDetail.findOne({ email_address });
        if (userAvailable) {
            return res.status(200).json({ code: 400, message: "the user is registered" });
        }
        const usernameAvailable = await UserDetail.findOne({ username });
        if (usernameAvailable) {
            return res.status(200).json({ code: 400, message: "the username has already" });
        }
        const phoneAvailable = await UserDetail.findOne({ phone_number });
        if (phoneAvailable) {
            return res.status(200).json({ code: 400, message: "the phone number has already" });
        }
    } catch (error) {
        res.status(500);
        throw new Error("internal server error");
    }

    const userDetail = await UserDetail.create(
        {
            username: username,
            email_address: email_address,
            phone_number: phone_number,
            password: password,
            address: address,
            user_id: req.user.id
        }
    );
    res.status(201).json(userDetail);
});

//@desc Update user details
//@route PUT /api/user_detail
//@access private
const updateUserDetail = asyncHandler(async (req, res) => {
    try {
        const userDetail = await UserDetail.findById({ _id: req.params.id });
        if (!userDetail) {
            res.status(404);
            throw new Error("this id not found");
        }
        if (userDetail.user_id.toString() !== req.user.id) {
            res.status(403);
            throw new Error("user don't have permission to update other data");
        }
    } catch (error) {
        res.status(404);
        throw new Error("this id is not found");
    }

    try {
        const updateRes = await UserDetail.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        console.log(updateRes);
        res.status(200).json({ code: 200, message: "success" });
    } catch (error) {
        res.status(500).json({ code: 500, message: "internal server error" });
    }
});

//@desc Delete user details
//@route DELETE /api/user_detail/:id
//@access private
const deleteUserDetail = asyncHandler(async (req, res) => {
    try {
        const userDetail = await UserDetail.findById({ _id: req.params.id });
        if (!userDetail) {
            res.status(404);
            throw new Error("this id not found");
        }
        if (userDetail.user_id.toString() !== req.user.id) {
            res.status(403);
            throw new Error("user don't have permission to update other data");
        }
    } catch (error) {
        res.status(404);
        throw new Error("this id is not found");
    }

    try {
        const resDel = await UserDetail.deleteOne({ _id: req.params.id });
        console.log(resDel);
        res.status(200).json({ code: 200, message: "success" });
    } catch (error) {
        res.status(500).json({ code: 500, message: "internal server error" });
    }
});

//@desc login user details
//@route POST /api/user_detail/login
//@access private
const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400);
        throw new Error("All fields are mandatory !");
    }

    const user = await UserDetail.findOne({ username });
    //compare password with hashed password
    if (user && password == user.password) {
        res.status(200).json({ code: 200, message: "Login success" });
    } else {
        res.status(200).json({ code: 203, message: "Email or password is not valid" });
    }
});

module.exports = { getUserDetail, createUserDetail, updateUserDetail, getUserDetailById, deleteUserDetail, login };