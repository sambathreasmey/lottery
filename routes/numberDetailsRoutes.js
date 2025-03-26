const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");
const { getAllNumberDetail, getNumberDetailById, createNumberDetail, deleteNumberDetail, updateNumberDetail, createNumberDetailV2, inputCheckNumberFilter } = require("../controllers/numberDetailsController");

router.use(validateToken);
router.route("/").get(getAllNumberDetail);
router.route("/:id").get(getNumberDetailById);
router.route("/").post(createNumberDetail);
router.route("/:id").delete(deleteNumberDetail);
router.route("/:id").put(updateNumberDetail);
router.route("/inp_check").post(inputCheckNumberFilter);

module.exports = router;