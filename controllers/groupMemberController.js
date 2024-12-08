const asyncHandler = require("express-async-handler");
const GroupMember = require("../models/groupMemberModel");
const { ResultMessage } = require("../pattern/response/resultMessage");

//@desc Get all group member
//@route GET /api/group_member
//@access private
const getAllGroupMember = asyncHandler(async (req, res) => {
    const groupMember = await GroupMember.find();
    return res.status(200).json(new ResultMessage(200, 'success', groupMember));
});

//@desc Get by id group member
//@route GET /api/group_member
//@access private
const getGroupMemberById = asyncHandler(async (req, res) => {
    try {
        const groupMember = await GroupMember.findOne({ _id: req.params.id });
        if (!groupMember) {
            return res.status(200).json(new ResultMessage(404, 'this id is not found !'));
        }
        
        return res.status(200).json(new ResultMessage(200, 'success', groupMember));
    } catch (error) {
        return res.status(200).json(new ResultMessage(404, 'this id is not found !'));
    }
});

//@desc create group member
//@route POST /api/group_member
//@access private
const createGroupMember = asyncHandler(async (req, res) => {
    const { real_name, nick_name, phone, lottery_type, multi_x2, multi_x3, pay_x2, pay_x3, pay_x4, pay_x5, percentage } = req.body;
    if (!real_name || !nick_name || !phone || !lottery_type || !multi_x2 || !multi_x3 || !pay_x2 || !pay_x3 || !pay_x4 || !pay_x5 || !percentage) {
        return res.status(400).json(new ResultMessage(400, 'all fields are mandatory !'));
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
            user_id: req.user.id
        }
    );
    res.status(200).json(new ResultMessage(200, 'insert successful', groupMember));
});

//@desc Delete group member
//@route DELETE /api/group_member/:id
//@access private
const deleteGroupMember = asyncHandler(async (req, res) => {

    try {
        const groupMember = await GroupMember.findById({ _id: req.params.id });
        if (!groupMember) {
            return res.status(200).json(new ResultMessage(404, 'this id is not found !'));
        }
        if (groupMember.user_id.toString() !== req.user.id) {
            return res.status(403).json(new ResultMessage(403, "user don't have permission to update other data !"));
        }
    } catch (error) {
        return res.status(200).json(new ResultMessage(404, 'this id is not found !'));
    }

    try {
        const resDel = await GroupMember.deleteOne({ _id: req.params.id });
        return res.status(201).json(new ResultMessage(200, 'delete successful', resDel));
    } catch (error) {
        return res.status(500).json(new ResultMessage(500, 'internal server error !'));
    }

});

//@desc Update group member
//@route PUT /api/group_member/:id
//@access private
const updateGroupMember = asyncHandler(async (req, res) => {
    try {
        const groupMember = await GroupMember.findById({ _id: req.params.id });
        if (!groupMember) {
            return res.status(200).json(new ResultMessage(404, 'this id is not found !'));
        }
        if (groupMember.user_id.toString() !== req.user.id) {
            return res.status(403).json(new ResultMessage(403, "user don't have permission to update other data !"));
        }
    } catch (error) {
        return res.status(200).json(new ResultMessage(404, 'this id is not found !'));
    }

    try {
        const updateRes = await GroupMember.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        return res.status(200).json(new ResultMessage(200, 'update successful', updateRes));
    } catch (error) {
        return res.status(500).json(new ResultMessage(500, 'internal server error !'));
    }
});


module.exports = { getAllGroupMember, getGroupMemberById, createGroupMember, deleteGroupMember, updateGroupMember };