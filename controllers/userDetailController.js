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
    const userDetail = await UserDetail.find({_id: req.params.id});
    res.status(200).json(userDetail);
});

//@desc create contact
//@route POST /api/user_detail
//@access private
const createUserDetail = asyncHandler(async (req, res) => {
    const {username, phone_number, password, email_address, address} = req.body;
    if (!username || !phone_number || !password || !email_address || !address) {
        res.status(400);
        throw new Error("All fields are mandatory !");
    }
    const userDetail = await UserDetail.create(
        {username: username,
            email_address: email_address,
            phone_number: phone_number,
            password: password,
            address: address,
            user_id: req.user.id
        }
    );
    res.status(201).json(userDetail);
});

//@desc Update contact
//@route PUT /api/user_detail
//@access private
const updateUserDetail = asyncHandler(async (req, res) => {
    const userDetail = await UserDetail.findById({_id: req.params.id});
    if (!userDetail) {
        res.status(404);
        throw new Error("User not found");
    }

    if (userDetail.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User API don't have permission to update other user Users");
    }

    const updateContact = await UserDetail.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true}
    );
    res.status(200).json(updateContact);
});

//@desc Delete contact
//@route DELETE /api/user_detail/:id
//@access private
const deleteUserDetail = asyncHandler(async (req, res) => {
    const userDetail = await UserDetail.findById({_id: req.params.id});
    if (!userDetail) {
        res.status(404);
        throw new Error("User not found");
    }

    if (userDetail.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User API don't have permission to update other user Users");
    }
    await UserDetail.deleteOne({_id: req.params.id});
    res.status(200).json({message: "success"});
});

module.exports = { getUserDetail, createUserDetail, updateUserDetail, getUserDetailById, deleteUserDetail };