const asyncHandler = require("express-async-handler");
const GroupMember = require("../models/groupMemberModel");

//@desc Get all group member
//@route GET /api/group_member
//@access private
const getAllGroupMember = asyncHandler(async (req, res) => {
    const groupMember = await GroupMember.find();
    res.status(200).json(groupMember);
});

//@desc Get by id group member
//@route GET /api/group_member
//@access private
const getGroupMemberById = asyncHandler(async (req, res) => {
    try {
        const groupMember = await GroupMember.findOne({ _id: req.params.id });
        if (!groupMember) {
            res.status(404);
            throw new Error("This id is not found");
        }
        res.status(200).json(groupMember);
    } catch (error) {
        res.status(404);
        throw new Error("This id is not found");
    }
});

//@desc create group member
//@route POST /api/group_member
//@access private
const createGroupMember = asyncHandler(async (req, res) => {
    const { real_name, nick_name, phone, lottery_type, multi_x2, multi_x3, pay_x2, pay_x3, pay_x4, pay_x5, percentage } = req.body;
    if (!real_name || !nick_name || !phone || !lottery_type || !multi_x2 || !multi_x3 || !pay_x2 || !pay_x3 || !pay_x4 || !pay_x5 || !percentage) {
        res.status(400);
        throw new Error("All fields are mandatory !");
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
    res.status(201).json(groupMember);
});

//@desc Delete group member
//@route DELETE /api/group_member/:id
//@access private
const deleteGroupMember = asyncHandler(async (req, res) => {

    try {
        const groupMember = await GroupMember.findById({ _id: req.params.id });
        if (!groupMember) {
            res.status(404);
            throw new Error("This id not found");
        }
        if (groupMember.user_id.toString() !== req.user.id) {
            res.status(403);
            throw new Error("User don't have permission to update other data");
        }
    } catch (error) {
        res.status(404);
        throw new Error("This id is not found");
    }

    try {
        const resDel = await GroupMember.deleteOne({ _id: req.params.id });
        console.log(resDel);
        res.status(200).json({ code: 200, message: "success" });
    } catch (error) {
        res.status(500).json({ code: 500, message: "internal server error" });
    }

});

//@desc Update group member
//@route PUT /api/group_member/:id
//@access private
const updateGroupMember = asyncHandler(async (req, res) => {
    try {
        const groupMember = await GroupMember.findById({ _id: req.params.id });
        if (!groupMember) {
            res.status(404);
            throw new Error("this id not found");
        }
        if (groupMember.user_id.toString() !== req.user.id) {
            res.status(403);
            throw new Error("user don't have permission to update other data");
        }
    } catch (error) {
        res.status(404);
        throw new Error("this id is not found");
    }

    try {
        const updateRes = await GroupMember.findByIdAndUpdate(
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


module.exports = { getAllGroupMember, getGroupMemberById, createGroupMember, deleteGroupMember, updateGroupMember };