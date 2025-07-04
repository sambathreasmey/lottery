const express = require("express");
const router = express.Router();
const validateToken = require("../../app/middleware/validateTokenHandler");
const { getAllPostCategoryDetail, createPostCategory, deletePostCategoryDetail } = require("./postDetailsController");

router.use(validateToken);
router.route("/").get(getAllPostCategoryDetail);
router.route("/").post(createPostCategory);
router.route("/:id").delete(deletePostCategoryDetail);

module.exports = router;