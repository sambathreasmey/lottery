const asyncHandler = require("express-async-handler");
const NumberDetail = require("../models/numberDetailsModel");
const { ResultMessage } = require("../pattern/response/resultMessage");

//@desc Get all number detail
//@route GET /api/number_detail
//@access private
const getAllNumberDetail = asyncHandler(async (req, res) => {
    const numberDetail = await NumberDetail.find();
    return res.status(200).json(new ResultMessage(200, 'success', numberDetail));
});

//@desc Get by id number detail
//@route GET /api/number_detail
//@access private
const getNumberDetailById = asyncHandler(async (req, res) => {
    try {
        const numberDetail = await NumberDetail.findOne({ _id: req.params.id });
        if (!numberDetail) {
            return res.status(200).json(new ResultMessage(404, 'this id is not found !'));
        }
        return res.status(200).json(new ResultMessage(200, 'success', numberDetail));
    } catch (error) {
        return res.status(200).json(new ResultMessage(404, 'this id is not found !'));
    }
});

//@desc create number detail
//@route POST /api/number_detail
//@access private
const createNumberDetail = asyncHandler(async (req, res) => {
    const { post_name, post_type, admin_name, group_id, date, lottery_number, lottery_amount, lottery_curency, paper, part, line } = req.body;
    if (!post_name || !post_type || !admin_name || !group_id || !date || !lottery_number || !lottery_amount || !lottery_curency || !paper || !part || !line) {
        return res.status(400).json(new ResultMessage(400, 'all fields are mandatory !'));
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
    res.status(200).json(new ResultMessage(200, 'insert successful', numberDetail));
});

//@desc Delete number detail
//@route DELETE /api/number_detail/:id
//@access private
const deleteNumberDetail = asyncHandler(async (req, res) => {

    try {
        const numberDetail = await NumberDetail.findById({ _id: req.params.id });
        if (!numberDetail) {
            return res.status(200).json(new ResultMessage(404, 'this id is not found !'));
        }
        if (numberDetail.user_id.toString() !== req.user.id) {
            return res.status(403).json(new ResultMessage(403, "user don't have permission to update other data !"));
        }
    } catch (error) {
        return res.status(200).json(new ResultMessage(404, 'this id is not found !'));
    }

    try {
        const resDel = await NumberDetail.deleteOne({ _id: req.params.id });
        return res.status(200).json(new ResultMessage(200, 'delete successful', resDel));
    } catch (error) {
        return res.status(500).json(new ResultMessage(500, 'internal server error !'));
    }

});

//@desc Update number detail
//@route PUT /api/number_detail/:id
//@access private
const updateNumberDetail = asyncHandler(async (req, res) => {
    try {
        const numberDetail = await NumberDetail.findById({ _id: req.params.id });
        if (!numberDetail) {
            return res.status(200).json(new ResultMessage(404, 'this id is not found !'));
        }
        if (numberDetail.user_id.toString() !== req.user.id) {
            return res.status(403).json(new ResultMessage(403, "user don't have permission to update other data !"));
        }
    } catch (error) {
        return res.status(200).json(new ResultMessage(404, 'this id is not found !'));
    }

    try {
        const updateRes = await NumberDetail.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        
        return res.status(200).json(new ResultMessage(200, 'update successful', updateRes));
    } catch (error) {
        res.status(500).json({ code: 500, message: "internal server error" });
    }
});


module.exports = { getAllNumberDetail, getNumberDetailById, createNumberDetail, deleteNumberDetail, updateNumberDetail };