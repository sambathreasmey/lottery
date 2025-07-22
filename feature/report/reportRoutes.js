const express = require("express");
const router = express.Router();
const validateToken = require("../../app/middleware/validateTokenHandler");
const { getReport, getCompareReport } = require("./reportController");

router.use(validateToken);
router.route('/fetch').post(getReport);
router.route('/compare-fetch').post(getCompareReport);

module.exports = router;