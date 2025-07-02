const asyncHandler = require("express-async-handler");
const PostDetail = require("./model/postDetailsModel");
const { ResultMessage } = require("../../app/pattern/response/resultMessage");
const { POST_TYPE, MESSAGE, CODE } = require("../../app/constant/constants");

//@desc Get all result number detail
//@route GET /api/result_number_detail
//@access private
const getAllPostCategoryDetail = asyncHandler(async (req, res) => {
    const postCategory = await PostDetail.find({ type: POST_TYPE.POST_CATEGORY});

    // DEV ONLY delete all
    // numberDetail.forEach(async num => {
    //     console.log(num._id);
    //     const resDel = await NumberDetail.deleteOne({ _id: num._id });
    // });

    return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.SUCCESS, postCategory));
});

//@desc Get all result number detail
//@route GET /api/result_number_detail
//@access private
const getAllPostSubCategoryDetail = asyncHandler(async (req, res) => {
    const postSubCategory = await PostDetail.find({ type: POST_TYPE.POST_SUB_CATEGORY});

    // DEV ONLY delete all
    // numberDetail.forEach(async num => {
    //     console.log(num._id);
    //     const resDel = await NumberDetail.deleteOne({ _id: num._id });
    // });

    return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.SUCCESS, postSubCategory));
});

//@desc Get all result number detail
//@route GET /api/result_number_detail
//@access private
const getPostSubCategoryByCategoryId = asyncHandler(async (req, res) => {
    const postSubCategory = await PostDetail.find({ post_category_id: req.params.id});

    // DEV ONLY delete all
    // numberDetail.forEach(async num => {
    //     console.log(num._id);
    //     const resDel = await NumberDetail.deleteOne({ _id: num._id });
    // });

    return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.SUCCESS, postSubCategory));
});

//@desc create result number detail
//@route POST /api/result_number_detail
//@access private
const createPostCategory = asyncHandler(async (req, res) => {
    const { post_category } = req.body;
    if (!post_category) {
        return res.status(200).json(new ResultMessage(CODE.REQUIRE, MESSAGE.REQUIRE));
    }
    const postDetail = await PostDetail.create(
        {
            type: POST_TYPE.POST_CATEGORY,
            post_category: post_category,
            user_id: req.user.id
        }
    );
    res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.INSERTED, postDetail));
});

//@desc create result number detail
//@route POST /api/result_number_detail
//@access private
const createPostSubCategory = asyncHandler(async (req, res) => {
    const { post_category_id, post_name } = req.body;
    if (!post_category_id || !post_name) {
        return res.status(200).json(new ResultMessage(CODE.REQUIRE, MESSAGE.REQUIRE));
    }

    try {
        const postDetailCheck = await PostDetail.findOne({ _id: post_category_id, type: POST_TYPE.POST_CATEGORY});
        if (!postDetailCheck) {
            return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, "post_category_id is " + MESSAGE.NOT_FOUND));
        }
        if (postDetailCheck.area_id?.toString().trim() !== String(req.user.id).trim()) {
            return res.status(403).json(new ResultMessage(CODE.CREDENTIAL, MESSAGE.CREDENTIAL));
        }
    } catch (error) {
        return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, "post_category_id is " + MESSAGE.NOT_FOUND));
    }

    const postDetail = await PostDetail.create(
        {
            type: POST_TYPE.POST_SUB_CATEGORY,
            post_category_id: post_category_id,
            post_name: post_name,
            user_id: req.user.id
        }
    );
    res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.INSERTED, postDetail));
});

//@desc Delete result number detail
//@route DELETE /api/result_number_detail/:id
//@access private
const deletePostCategoryDetail = asyncHandler(async (req, res) => {

    try {
        const postDetail = await PostDetail.findOne({ _id: req.params.id, type: POST_TYPE.POST_CATEGORY});
        if (!postDetail) {
            return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
        }
        if (postDetail.area_id?.toString().trim() !== String(req.user.id).trim()) {
            return res.status(403).json(new ResultMessage(CODE.CREDENTIAL, MESSAGE.CREDENTIAL));
        }
    } catch (error) {
        return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
    }

    try {
        const resDelSubCategory = await PostDetail.deleteMany({ post_category_id: req.params.id });
        const resDelCategory = await PostDetail.deleteOne({ _id: req.params.id });
        return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.DELETED, resDelSubCategory));
    } catch (error) {
        return res.status(500).json(new ResultMessage(CODE.GENERAL_EXCEPTION, MESSAGE.GENERAL_EXCEPTION));
    }

});

//@desc Delete result number detail
//@route DELETE /api/result_number_detail/:id
//@access private
const deletePostSubCategoryDetail = asyncHandler(async (req, res) => {

    try {
        const postDetail = await PostDetail.findOne({ _id: req.params.id, type: POST_TYPE.POST_SUB_CATEGORY});
        if (!postDetail) {
            return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
        }
        if (postDetail.area_id?.toString().trim() !== String(req.user.id).trim()) {
            return res.status(403).json(new ResultMessage(CODE.CREDENTIAL, MESSAGE.CREDENTIAL));
        }
    } catch (error) {
        return res.status(200).json(new ResultMessage(CODE.NOT_FOUND, MESSAGE.NOT_FOUND));
    }

    try {
        const resDel = await PostDetail.deleteOne({ _id: req.params.id });
        return res.status(200).json(new ResultMessage(CODE.SUCCESS, MESSAGE.DELETED, resDel));
    } catch (error) {
        return res.status(500).json(new ResultMessage(CODE.GENERAL_EXCEPTION, MESSAGE.GENERAL_EXCEPTION));
    }

});

module.exports = { getAllPostCategoryDetail, getAllPostSubCategoryDetail, getPostSubCategoryByCategoryId, createPostCategory, createPostSubCategory, deletePostCategoryDetail, deletePostSubCategoryDetail };