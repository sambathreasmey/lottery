const express = require("express");
const router = express.Router();
const validateToken = require("../../app/middleware/validateTokenHandler");
const { getAllResultNumberDetail, getResultNumberDetailById, createResultNumberDetail, deleteResultNumberDetail, updateResultNumberDetail,
    fetchByDate
} = require("./resultNumberDetailsController");

router.use(validateToken);
router.route("/").get(getAllResultNumberDetail);
router.route("/:id").get(getResultNumberDetailById);
router.route("/").post(createResultNumberDetail);
router.route("/:id").delete(deleteResultNumberDetail);
router.route("/:id").put(updateResultNumberDetail);
router.route("/fetch_by_date").post(fetchByDate);

module.exports = router;