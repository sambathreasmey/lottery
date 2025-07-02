const express = require("express");
const router = express.Router();
const validateToken = require("../../app/middleware/validateTokenHandler");
const { getReport } = require("./reportController");

router.use(validateToken);
router.route('/fetch').post(getReport);

module.exports = router;