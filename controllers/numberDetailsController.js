const asyncHandler = require("express-async-handler");
const NumberDetail = require("../models/numberDetailsModel");

//@desc Get all number detail
//@route GET /api/number_detail
//@access private
const getAllNumberDetail = asyncHandler(async (req, res) => {
    const numberDetail = await NumberDetail.find();
    res.status(200).json(numberDetail);
});

//@desc Get by id number detail
//@route GET /api/number_detail
//@access private
const getNumberDetailById = asyncHandler(async (req, res) => {
    try {
        const numberDetail = await NumberDetail.findOne({ _id: req.params.id });
        if (!numberDetail) {
            res.status(404);
            throw new Error("This id is not found");
        }
        res.status(200).json(numberDetail);
    } catch (error) {
        res.status(404);
        throw new Error("This id is not found");
    }
});

//@desc create number detail
//@route POST /api/number_detail
//@access private
const createNumberDetail = asyncHandler(async (req, res) => {
    const { post_name, post_type, admin_name, group_id, date, lottery_number, lottery_amount, lottery_curency, paper, part, line } = req.body;
    if (!post_name || !post_type || !admin_name || !group_id || !date || !lottery_number || !lottery_amount || !lottery_curency || !paper || !part || !line) {
        res.status(400);
        throw new Error("All fields are mandatory !");
    }
    const numberDetail = await NumberDetail.create(
        {
            post_name: post_name,
            post_type: post_type,
            admin_name: admin_name,
            group_id: group_id,
            date: date,
            lottery_number: lottery_number,
            lottery_amount: lottery_amount,
            lottery_curency: lottery_curency,
            paper: paper,
            part: part,
            line: line,
            user_id: req.user.id
        }
    );
    res.status(201).json(numberDetail);
});

//@desc Delete number detail
//@route DELETE /api/number_detail/:id
//@access private
const deleteNumberDetail = asyncHandler(async (req, res) => {

    try {
        const numberDetail = await NumberDetail.findById({ _id: req.params.id });
        if (!numberDetail) {
            res.status(404);
            throw new Error("This id not found");
        }
        if (numberDetail.user_id.toString() !== req.user.id) {
            res.status(403);
            throw new Error("User don't have permission to update other data");
        }
    } catch (error) {
        res.status(404);
        throw new Error("This id is not found");
    }

    try {
        const resDel = await NumberDetail.deleteOne({ _id: req.params.id });
        console.log(resDel);
        res.status(200).json({ code: 200, message: "success" });
    } catch (error) {
        res.status(500).json({ code: 500, message: "internal server error" });
    }

});

//@desc Update number detail
//@route PUT /api/number_detail/:id
//@access private
const updateNumberDetail = asyncHandler(async (req, res) => {
    try {
        const numberDetail = await NumberDetail.findById({ _id: req.params.id });
        if (!numberDetail) {
            res.status(404);
            throw new Error("this id not found");
        }
        if (numberDetail.user_id.toString() !== req.user.id) {
            res.status(403);
            throw new Error("user don't have permission to update other data");
        }
    } catch (error) {
        res.status(404);
        throw new Error("this id is not found");
    }

    try {
        const updateRes = await NumberDetail.findByIdAndUpdate(
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


module.exports = { getAllNumberDetail, getNumberDetailById, createNumberDetail, deleteNumberDetail, updateNumberDetail };