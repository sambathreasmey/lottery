const express = require("express");
const router = express.Router();
const { getUserDetail, createUserDetail, updateUserDetail, getUserDetailById, deleteUserDetail, login } = require("../controllers/userDetailController");
const validateToken = require("../middleware/validateTokenHandler");

router.use(validateToken);
router.route("/").get(getUserDetail);
router.route("/").post(createUserDetail);
router.route("/:id").get(getUserDetailById);
router.route("/:id").put(updateUserDetail);
router.route("/:id").delete(deleteUserDetail);
router.route("/login").post(login);

module.exports = router;
