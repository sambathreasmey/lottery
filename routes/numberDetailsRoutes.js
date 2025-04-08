const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");
const { getAllNumberDetail, getNumberDetailById, createNumberDetail, deleteNumberDetail, updateNumberDetail, inputCheckNumberFilter, createCompareNumberDetail, deleteCompareNumberDetail, updateCompareNumberDetail } = require("../controllers/numberDetailsController");

router.use(validateToken);
router.route("/").get(getAllNumberDetail);
router.route("/:id").get(getNumberDetailById);
router.route("/").post(createNumberDetail);
router.route("/:id").delete(deleteNumberDetail);
router.route("/:id").put(updateNumberDetail);
router.route("/inp_check").post(inputCheckNumberFilter);
router.route("/inp_check_submit").post(createCompareNumberDetail);
router.route("/inp_check/:id").delete(deleteCompareNumberDetail);
router.route("/inp_check/:id").put(updateCompareNumberDetail);

module.exports = router;
