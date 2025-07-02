const express = require("express");
const router = express.Router();
const validateToken = require("../../app/middleware/validateTokenHandler");
const { getAllNumberDetail, getNumberDetailById, createNumberDetail, deleteNumberDetail, updateNumberDetail, inputCheckNumberFilter, createCompareNumberDetail, deleteCompareNumberDetail, updateCompareNumberDetail, getPageByDateAndGroup, createNumberDetailV2, inputCheckNumberFilterV2, updateNumberDetailV2, deleteNumberDetailV2 } = require("./numberDetailsController");

router.use(validateToken);
router.route("/").get(getAllNumberDetail);
router.route("/:id").get(getNumberDetailById);
router.route("/add").post(createNumberDetailV2);
router.route("/update/:id").put(updateNumberDetailV2);
router.route("/delete/:id").delete(deleteNumberDetailV2);
router.route("/:id").delete(deleteNumberDetail);
router.route("/:id").put(updateNumberDetail);
router.route("/fetch").post(inputCheckNumberFilterV2);
router.route("/inp_check_submit").post(createCompareNumberDetail);
router.route("/inp_check/:id").delete(deleteCompareNumberDetail);
router.route("/inp_check/:id").put(updateCompareNumberDetail);
router.route("/get_page_by_date_and_group").post(getPageByDateAndGroup);

module.exports = router;
