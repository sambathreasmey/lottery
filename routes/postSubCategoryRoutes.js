const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");
const { getAllPostSubCategoryDetail, getPostSubCategoryByCategoryId, createPostSubCategory, deletePostSubCategoryDetail } = require("../controllers/postDetailsController");

router.use(validateToken);
router.route("/").get(getAllPostSubCategoryDetail);
router.route("/:id").get(getPostSubCategoryByCategoryId);
router.route("/").post(createPostSubCategory);
router.route("/:id").delete(deletePostSubCategoryDetail);

module.exports = router;