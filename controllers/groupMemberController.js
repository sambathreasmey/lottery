const asyncHandler = require("express-async-handler");
const GroupMember = require("../models/groupMemberModel");
const { ResultMessage } = require("../pattern/response/resultMessage");
const { CODE, MESSAGE } = require("../constants");

//@desc Get all group member
//@route GET /api/group_member
//@access private
const getAllGroupMember = asyncHandler(async (req, res) => {
    const groupMember = await GroupMember.find();
    return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.SUCCESS, groupMember));
});

//@desc Get by id group member
//@route GET /api/group_member
//@access private
const getGroupMemberById = asyncHandler(async (req, res) => {
    try {
        const groupMember = await GroupMember.findOne({ _id: req.params.id });
        if (!groupMember) {
            return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
        }
        
        return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.SUCCESS, groupMember));
    } catch (error) {
        return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
    }
});

//@desc create group member
//@route POST /api/group_member
//@access private
const createGroupMember = asyncHandler(async (req, res) => {
    const { real_name, nick_name, phone, lottery_type, multi_x2, multi_x3, pay_x2, pay_x3, pay_x4, pay_x5, percentage, key } = req.body;
    if (!real_name || !nick_name || !phone || !lottery_type || !multi_x2 || !multi_x3 || !pay_x2 || !pay_x3 || !pay_x4 || !pay_x5 || !percentage || !key) {
        return res.status(200).json(new ResultMessage(CODE.REQUIRE, MESSAGE.REQUIRE));
    }
    const groupMember = await GroupMember.create(
        {
            real_name: real_name,
            nick_name: nick_name,
            phone: phone,
            lottery_type: lottery_type,
            multi_x2: multi_x2,
            multi_x3: multi_x3,
            pay_x2: pay_x2,
            pay_x3: pay_x3,
            pay_x4: pay_x4,
            pay_x5: pay_x5,
            percentage: percentage,
            key: key,
            user_id: req.user.id
        }
    );
    res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.INSERTED, groupMember));
});

//@desc Delete group member
//@route DELETE /api/group_member/:id
//@access private
const deleteGroupMember = asyncHandler(async (req, res) => {

    try {
        const groupMember = await GroupMember.findById({ _id: req.params.id });
        if (!groupMember) {
            return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
        }
        if (groupMember.user_id.toString() !== req.user.id) {
            return res.status(200).json(new ResultMessage(CODE.CREDENTIAL, MESSAGE.CREDENTIAL));
        }
    } catch (error) {
        return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
    }

    try {
        const resDel = await GroupMember.deleteOne({ _id: req.params.id });
        return res.status(201).json(new ResultMessage(CODE.SUCCESS, MESSAGE.DELETED, resDel));
    } catch (error) {
        return res.status(500).json(new ResultMessage(CODE.GENERAL_EXCEPTION, MESSAGE.GENERAL_EXCEPTION));
    }

});

//@desc Update group member
//@route PUT /api/group_member/:id
//@access private
const updateGroupMember = asyncHandler(async (req, res) => {
    try {
        const groupMember = await GroupMember.findById({ _id: req.params.id });
        if (!groupMember) {
            return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
        }
        if (groupMember.user_id.toString() !== req.user.id) {
            return res.status(200).json(new ResultMessage(CODE.CREDENTIAL, MESSAGE.CREDENTIAL));
        }
    } catch (error) {
        return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
    }

    try {
        const updateRes = await GroupMember.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.UPDATED, updateRes));
    } catch (error) {
        return res.status(500).json(new ResultMessage(CODE.GENERAL_EXCEPTION, MESSAGE.GENERAL_EXCEPTION));
    }
});


module.exports = { getAllGroupMember, getGroupMemberById, createGroupMember, deleteGroupMember, updateGroupMember };