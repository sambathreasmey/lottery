const asyncHandler = require("express-async-handler");
const UserDetail = require("../models/userDetailModel");
const { ResultMessage } = require("../pattern/response/resultMessage");
const { MESSAGE, CODE, USER_TYPE } = require("../constants");
const { Util } = require("../util");
const LoginSession = require("../models/loginSessionModel");
const { v4: uuidv4 } = require('uuid');

//@desc Get all user details
//@route GET /api/user_detail
//@access private
const getUserDetail = asyncHandler(async (req, res) => {
    const userDetail = await UserDetail.find();
    return res.status(200).json(new ResultMessage(CODE.SUCCESS, 'success', userDetail));
});

//@desc Get by id user detail
//@route GET /api/user_detail
//@access private
const getUserDetailById = asyncHandler(async (req, res) => {
    try {
        const userDetail = await UserDetail.findOne({ _id: req.params.id });
        if (!userDetail) {
            return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
        }
        const latestSession = await LoginSession.findOne({ user_id })
          .sort({ createdAt: -1 }) // sort by createdAt in descending order
          .exec();
        response = {
            "_id": userDetail._id,
            "username": userDetail.username,
            "phone_number": userDetail.phone_number,
            "email_address": userDetail.email_address,
            "address": userDetail.address,
            "login_id": latestSession.login_id
        }
        return res.status(200).json(new ResultMessage(CODE.SUCCESS, 'success', response));
    } catch (error) {
        return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
    }
});

//@desc create user details
//@route POST /api/user_detail
//@access private
const createUserDetail = asyncHandler(async (req, res) => {
    const { username, phone_number, password, email_address, address, role, status } = req.body;
    if (!username || !phone_number || !password || !email_address || !address || !role || !status) {
        return res.status(200).json(new ResultMessage(CODE.REQUIRE, MESSAGE.REQUIRE));
    }

    try {
        const userAvailable = await UserDetail.findOne({ email_address: email_address});
        if (userAvailable) {
            return res.status(200).json(new ResultMessage(CODE.REQUIRE, 'the user is registered !'));
        }
        const usernameAvailable = await UserDetail.findOne({ username: username });
        if (usernameAvailable) {
            return res.status(200).json(new ResultMessage(CODE.REQUIRE, 'the username has already !'));
        }
        const phoneAvailable = await UserDetail.findOne({ phone_number: phone_number });
        if (phoneAvailable) {
            return res.status(200).json(new ResultMessage(CODE.REQUIRE, 'the phone number has already !'));
        }
    } catch (error) {
        return res.status(500).json(new ResultMessage(CODE.GENERAL_EXCEPTION, MESSAGE.GENERAL_EXCEPTION));
    }

    const userDetail = await UserDetail.create(
        {
            username: username,
            email_address: email_address,
            phone_number: phone_number,
            password: password,
            address: address,
            role: role,
            status: status,
            // permission setting
            input_lottery_menu: 0,
            input_lottery_permission: 0,
            compare_lottery_menu: 0,
            compare_lottery_permission: 0,
            result_lottery_menu: 0,
            result_lottery_permission: 0,
            user_id: req.user.id
        }
    );
    res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.INSERTED, userDetail));
});

//@desc Update user details
//@route PUT /api/user_detail
//@access private
const updateUserDetail = asyncHandler(async (req, res) => {
    try {
        const userDetail = await UserDetail.findById({ _id: req.params.id });
        if (!userDetail) {
            return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
        }
        if (userDetail.user_id.toString() !== req.user.id) {
            return res.status(CODE.CREDENTIAL).json(new ResultMessage(CODE.CREDENTIAL, MESSAGE.CREDENTIAL));
        }
    } catch (error) {
        return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
    }

    try {
        const updateRes = await UserDetail.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.UPDATED, updateRes));
    } catch (error) {
        res.status(500).json({ code: CODE.GENERAL_EXCEPTION, message: MESSAGE.GENERAL_EXCEPTION });
    }
});

//@desc Delete user details
//@route DELETE /api/user_detail/:id
//@access private
const deleteUserDetail = asyncHandler(async (req, res) => {
    try {
        const userDetail = await UserDetail.findById({ _id: req.params.id });
        if (!userDetail) {
            return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
        }
        if (userDetail.user_id.toString() !== req.user.id) {
            return res.status(CODE.CREDENTIAL).json(new ResultMessage(CODE.CREDENTIAL, MESSAGE.CREDENTIAL));
        }
    } catch (error) {
        return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
    }

    try {
        const resDel = await UserDetail.deleteOne({ _id: req.params.id });
        return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.DELETED, resDel));
    } catch (error) {
        return res.status(500).json(new ResultMessage(CODE.GENERAL_EXCEPTION, MESSAGE.GENERAL_EXCEPTION));
    }
});

//@desc login user details
//@route POST /api/user_detail/login
//@access private
const login = asyncHandler(async (req, res) => {
    const { username, password , ip, location} = req.body;
    if (!username || !password || !ip || !location) {
        return res.status(200).json(new ResultMessage(CODE.REQUIRE, MESSAGE.REQUIRE));
    }

    const userDetail = await UserDetail.findOne({ username: username });
    //compare password with hashed password
    if (userDetail && password == userDetail.password) {
        const loginSession = await LoginSession.create(
            {
                username: username,
                user_id: userDetail._id,
                login_id: uuidv4(),
                ip: ip,
                location: location,
                user_id: req.user.id
            }
        );
        user = {
            "_id": userDetail._id,
            "username": userDetail.username,
            "phone_number": userDetail.phone_number,
            "email_address": userDetail.email_address,
            "address": userDetail.address,
            "login_on": new Util().getCurrentTime().formattedDate,
            "time_out": 43200,
            "login_id": loginSession.login_id
        }
        res.status(200).json({ code: CODE.SUCCESS, message: MESSAGE.LOGINED, user });
    } else {
        res.status(200).json({ code: 203, message: MESSAGE.INVALID_LOGIN });
    }
});

module.exports = { getUserDetail, createUserDetail, updateUserDetail, getUserDetailById, deleteUserDetail, login };
