const asyncHandler = require("express-async-handler");
const UserDetail = require("./model/userDetailModel");
const { ResultMessage } = require("../../app/pattern/response/resultMessage");
const { MESSAGE, CODE, USER_TYPE } = require("../../app/constant/constants");
const { DateUtil } = require("../../app/util/dateUtil");
const LoginSession = require("./model/loginSessionModel");
const { v4: uuidv4 } = require('uuid');

//@desc Get all user details
//@route GET /api/user_detail
//@access private
const getUserDetail = asyncHandler(async (req, res) => {
    const userDetail = await UserDetail.find();
    const response = userDetail.map(user => {
    const userObj = user.toObject(); // convert mongoose doc to plain JS object

    // Extract permission-related keys and values
    const permission = {};
    for (const key of Object.keys(userObj)) {
      if (key.endsWith('_menu') || key.endsWith('_permission')) {
        permission[key] = userObj[key];
        delete userObj[key]; // remove from top-level user object
      }
    }

    //DEV ONLY delete all
    // userDetail.forEach(async num => {
    //     console.log(num._id);
    //     const resDel = await UserDetail.deleteOne({ _id: num._id });
    // });

    // Add the grouped permission object
    userObj.permission = permission;

    return userObj;
  });
    return res.status(200).json(new ResultMessage(CODE.SUCCESS, 'success', response));
});

//@desc Get by id user detail
//@route GET /api/user_detail
//@access private
const getUserDetailById = asyncHandler(async (req, res) => {
    try {
        const id = req.params.id;
        console.log("Requested ID:", id);
        let login_id = "";
        
        const userDetail = await UserDetail.findById(id);
        if (!userDetail) {
            return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
        }
        const latestSession = await LoginSession.findOne({ username: userDetail.username })
          .sort({ createdAt: -1 }) // sort by createdAt in descending order
          .exec();
        if  (latestSession) {
            login_id = latestSession.login_id;
        }
        const response = {
            "_id": userDetail._id,
            "username": userDetail.username,
            "phone_number": userDetail.phone_number,
            "email_address": userDetail.email_address,
            "address": userDetail.address,
            "login_id": login_id,
            "role": userDetail.role,
            "permission": {
                agent_menu: userDetail.agent_menu,
                agent_permission: userDetail.agent_permission,
                post_time_menu: userDetail.post_time_menu,
                post_time_permission: userDetail.post_time_permission,
                input_lottery_menu: userDetail.input_lottery_menu,
                input_lottery_permission: userDetail.input_lottery_permission,
                verify_lottery_menu: userDetail.verify_lottery_menu,
                verify_lottery_permission: userDetail.verify_lottery_permission,
                result_lottery_menu: userDetail.result_lottery_menu,
                result_lottery_permission: userDetail.result_lottery_permission,
                sum_enter_menu: userDetail.sum_enter_menu,
                sum_enter_permission: userDetail.sum_enter_permission,
                win_number_menu: userDetail.win_number_menu,
                win_number_permission: userDetail.win_number_permission,
                user_manage_menu: userDetail.user_manage_menu,
                user_manage_permission: userDetail.user_manage_permission,
                report_menu: userDetail.report_menu,
                report_permission: userDetail.report_permission
            }
        }
        return res.status(200).json(new ResultMessage(CODE.SUCCESS, 'success', response));
    } catch (error) {
        console.log(error);
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
            agent_menu: 0,
            agent_permission: 0,
            post_time_menu: 0,
            post_time_permission: 0,
            input_lottery_menu: 0,
            input_lottery_permission: 0,
            verify_lottery_menu: 0,
            verify_lottery_permission: 0,
            result_lottery_menu: 0,
            result_lottery_permission: 0,
            sum_enter_menu: 0,
            sum_enter_permission: 0,
            win_number_menu: 0,
            win_number_permission: 0,
            user_manage_menu: 0,
            user_manage_permission: 0,
            report_menu: 0,
            report_permission: 0,
            area_id: req.user.id
        }
    );
    res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.INSERTED, userDetail));
});

//@desc Update user details
//@route PUT /api/user_detail
//@access private
const updateUserDetail = asyncHandler(async (req, res) => {
    console.log(req.body);
    try {
        const userDetail = await UserDetail.findById({ _id: req.params.id });
        if (!userDetail) {
            return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
        }
        if (userDetail.area_id?.toString().trim() !== String(req.user.id).trim()) {
            return res.status(403).json(new ResultMessage(CODE.CREDENTIAL, MESSAGE.CREDENTIAL));
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
        if (userDetail.area_id?.toString().trim() !== String(req.user.id).trim()) {
            return res.status(403).json(new ResultMessage(CODE.CREDENTIAL, MESSAGE.CREDENTIAL));
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
            "login_on": new DateUtil().getCurrentTime().formattedDate,
            "time_out": 43200,
            "login_id": loginSession.login_id
        }
        res.status(200).json({ code: CODE.SUCCESS, message: MESSAGE.LOGINED, user });
    } else {
        res.status(200).json({ code: 203, message: MESSAGE.INVALID_LOGIN });
    }
});

module.exports = { getUserDetail, createUserDetail, updateUserDetail, getUserDetailById, deleteUserDetail, login };
