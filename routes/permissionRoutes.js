const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");
const { getAllPermissionDetail, getPermissionDetailById, updatePermissionDetail } = require("../controllers/permissionController");

router.use(validateToken);
router.route("/").get(getAllPermissionDetail);
router.route("/:id").get(getPermissionDetailById);
router.route("/:id").put(updatePermissionDetail);

module.exports = router;