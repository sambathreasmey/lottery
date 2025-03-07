const asyncHandler = require("express-async-handler");
const NumberDetail = require("../models/numberDetailsModel");
const { ResultMessage } = require("../pattern/response/resultMessage");
const { LOTTERY_TYPE, MESSAGE, CODE } = require("../constants");

//@desc Get all number detail
//@route GET /api/number_detail
//@access private
const getAllNumberDetail = asyncHandler(async (req, res) => {
    const numberDetail = await NumberDetail.find({ type: LOTTERY_TYPE.LOTTERY_NUMBER});
    return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.SUCCESS, numberDetail));
});

//@desc Get by id number detail
//@route GET /api/number_detail
//@access private
const getNumberDetailById = asyncHandler(async (req, res) => {
    try {
        const numberDetail = await NumberDetail.findOne({ _id: req.params.id,  type: LOTTERY_TYPE.LOTTERY_NUMBER });
        if (!numberDetail) {
            return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
        }
        return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.SUCCESS, numberDetail));
    } catch (error) {
        return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
    }
});

//@desc create number detail
//@route POST /api/number_detail
//@access private
const createNumberDetail = asyncHandler(async (req, res) => {
    const { post_name, post_type, admin_name, group_id, date, lottery_number, lottery_amount, lottery_curency, paper, part, line } = req.body;
    if (!post_name || !post_type || !admin_name || !group_id || !date || !lottery_number || !lottery_amount || !lottery_curency || !paper || !part || !line) {
        return res.status(200).json(new ResultMessage(CODE.REQUIRE, MESSAGE.REQUIRE));
    }
    const numberDetail = await NumberDetail.create(
        {
            type: LOTTERY_TYPE.LOTTERY_NUMBER,
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
    res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.INSERTED, numberDetail));
});

//@desc Delete number detail
//@route DELETE /api/number_detail/:id
//@access private
const deleteNumberDetail = asyncHandler(async (req, res) => {

    try {
        const numberDetail = await NumberDetail.findOne({ _id: req.params.id, type: LOTTERY_TYPE.LOTTERY_RESULT});
        if (!numberDetail) {
            return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
        }
        if (numberDetail.user_id.toString() !== req.user.id) {
            return res.status(200).json(new ResultMessage(CODE.CREDENTIAL, MESSAGE.CREDENTIAL));
        }
    } catch (error) {
        return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
    }

    try {
        const resDel = await NumberDetail.deleteOne({ _id: req.params.id });
        return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.DELETED, resDel));
    } catch (error) {
        return res.status(500).json(new ResultMessage(CODE.GENERAL_EXCEPTION, MESSAGE.GENERAL_EXCEPTION));
    }

});

//@desc Update number detail
//@route PUT /api/number_detail/:id
//@access private
const updateNumberDetail = asyncHandler(async (req, res) => {
    try {
        const numberDetail = await NumberDetail.findOne({ _id: req.params.id, type: LOTTERY_TYPE.LOTTERY_RESULT});
        if (!numberDetail) {
            return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
        }
        if (numberDetail.user_id.toString() !== req.user.id) {
            return res.status(200).json(new ResultMessage(CODE.CREDENTIAL, MESSAGE.CREDENTIAL));
        }
    } catch (error) {
        return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
    }

    try {
        const updateRes = await NumberDetail.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        
        return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.UP, updateRes));
    } catch (error) {
        res.status(500).json({ code: CODE.GENERAL_EXCEPTION, message: MESSAGE.GENERAL_EXCEPTION });
    }
});


module.exports = { getAllNumberDetail, getNumberDetailById, createNumberDetail, deleteNumberDetail, updateNumberDetail };