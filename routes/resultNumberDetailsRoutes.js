const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");
const { getAllResultNumberDetail, getResultNumberDetailById, createResultNumberDetail, deleteResultNumberDetail, updateResultNumberDetail } = require("../controllers/resultNumberDetailsController");

router.use(validateToken);
router.route("/").get(getAllResultNumberDetail);
router.route("/:id").get(getResultNumberDetailById);
router.route("/").post(createResultNumberDetail);
router.route("/:id").delete(deleteResultNumberDetail);
router.route("/:id").put(updateResultNumberDetail);

module.exports = router;