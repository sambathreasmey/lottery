const asyncHandler = require("express-async-handler");
const UserDetail = require("../models/userDetailModel");
const { ResultMessage } = require("../pattern/response/resultMessage");

//@desc Get all user details
//@route GET /api/user_detail
//@access private
const getUserDetail = asyncHandler(async (req, res) => {
    const userDetail = await UserDetail.find();
    return res.status(200).json(new ResultMessage(200, 'success', userDetail));
});

//@desc Get by id user detail
//@route GET /api/user_detail
//@access private
const getUserDetailById = asyncHandler(async (req, res) => {
    try {
        const userDetail = await UserDetail.findOne({ _id: req.params.id });
        if (!userDetail) {
            return res.status(200).json(new ResultMessage(404, 'this id is not found !'));
        }
        return res.status(200).json(new ResultMessage(200, 'success', userDetail));
    } catch (error) {
        return res.status(200).json(new ResultMessage(404, 'this id is not found !'));
    }
});

//@desc create user details
//@route POST /api/user_detail
//@access private
const createUserDetail = asyncHandler(async (req, res) => {
    const { username, phone_number, password, email_address, address } = req.body;
    if (!username || !phone_number || !password || !email_address || !address) {
        return res.status(400).json(new ResultMessage(400, 'all fields are mandatory !'));
    }

    try {
        const userAvailable = await UserDetail.findOne({ email_address });
        if (userAvailable) {
            return res.status(200).json(new ResultMessage(400, 'the user is registered !'));
        }
        const usernameAvailable = await UserDetail.findOne({ username });
        if (usernameAvailable) {
            return res.status(200).json(new ResultMessage(400, 'the username has already !'));
        }
        const phoneAvailable = await UserDetail.findOne({ phone_number });
        if (phoneAvailable) {
            return res.status(200).json(new ResultMessage(400, 'the phone number has already !'));
        }
    } catch (error) {
        return res.status(500).json(new ResultMessage(500, 'internal server error !'));
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
    res.status(201).json(new ResultMessage(200, 'insert successful', userDetail));
});

//@desc Update user details
//@route PUT /api/user_detail
//@access private
const updateUserDetail = asyncHandler(async (req, res) => {
    try {
        const userDetail = await UserDetail.findById({ _id: req.params.id });
        if (!userDetail) {
            return res.status(200).json(new ResultMessage(404, 'this id is not found !'));
        }
        if (userDetail.user_id.toString() !== req.user.id) {
            return res.status(403).json(new ResultMessage(403, "user don't have permission to update other data !"));
        }
    } catch (error) {
        return res.status(200).json(new ResultMessage(404, 'this id is not found !'));
    }

    try {
        const updateRes = await UserDetail.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        return res.status(200).json(new ResultMessage(200, 'update successful', updateRes));
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
            return res.status(200).json(new ResultMessage(404, 'this id is not found !'));
        }
        if (userDetail.user_id.toString() !== req.user.id) {
            return res.status(403).json(new ResultMessage(403, "user don't have permission to update other data !"));
        }
    } catch (error) {
        return res.status(200).json(new ResultMessage(404, 'this id is not found !'));
    }

    try {
        const resDel = await UserDetail.deleteOne({ _id: req.params.id });
        return res.status(201).json(new ResultMessage(200, 'delete successful', resDel));
    } catch (error) {
        return res.status(500).json(new ResultMessage(500, 'internal server error !'));
    }
});

//@desc login user details
//@route POST /api/user_detail/login
//@access private
const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json(new ResultMessage(400, 'all fields are mandatory !'));
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