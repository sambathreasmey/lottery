const asyncHandler = require("express-async-handler");
const PermissionDetail = require("../models/userDetailModel");
const { ResultMessage } = require("../pattern/response/resultMessage");
const { MESSAGE, CODE } = require("../constants");

//@desc Get all permission detail
//@route GET /api/permission
//@access private
const getAllPermissionDetail = asyncHandler(async (req, res) => {
    const permissionDetail = await PermissionDetail.find();
    return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.SUCCESS,
        permissionDetail.map(permission => ({
            _id: permission._id,
            username: permission.username,
            role: permission.role,
            input_lottery_menu: permission.input_lottery_menu,
            input_lottery_permission: permission.input_lottery_permission,
            compare_lottery_menu: permission.compare_lottery_menu,
            compare_lottery_permission: permission.compare_lottery_permission,
            result_lottery_menu: permission.result_lottery_menu,
            result_lottery_permission: permission.result_lottery_permission,
        }))
    ));
});

//@desc Get by id permission detail
//@route GET /api/permission
//@access private
const getPermissionDetailById = asyncHandler(async (req, res) => {
    try {
        const permissionDetail = await PermissionDetail.findOne({ _id: req.params.id});
        if (!permissionDetail) {
            return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
        }
        return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.SUCCESS,
            {
                _id: permissionDetail._id,
                username: permissionDetail.username,
                role: permissionDetail.role,
                input_lottery_menu: permissionDetail.input_lottery_menu,
                input_lottery_permission: permissionDetail.input_lottery_permission,
                compare_lottery_menu: permissionDetail.compare_lottery_menu,
                compare_lottery_permission: permissionDetail.compare_lottery_permission,
                result_lottery_menu: permissionDetail.result_lottery_menu,
                result_lottery_permission: permissionDetail.result_lottery_permission,
            }
        ));
    } catch (error) {
        return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
    }
});

//@desc Update permission detail
//@route PUT /api/permission/:id
//@access private
const updatePermissionDetail = asyncHandler(async (req, res) => {
    try {
        const permissionDetail = await PermissionDetail.findOne({ _id: req.params.id});
        if (!permissionDetail) {
            return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
        }
        if (permissionDetail.user_id.toString() !== req.user.id) {
            return res.status(200).json(new ResultMessage(CODE.CREDENTIAL, MESSAGE.CREDENTIAL));
        }
    } catch (error) {
        return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
    }

    try {
        const updateRes = await PermissionDetail.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        
        return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.UPDATED, updateRes));
    } catch (error) {
        res.status(500).json({ code: CODE.GENERAL_EXCEPTION, message: MESSAGE.GENERAL_EXCEPTION });
    }
});


module.exports = { getAllPermissionDetail, getPermissionDetailById, updatePermissionDetail };