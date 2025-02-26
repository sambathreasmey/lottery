const express = require("express");
const { registerUser, loginUser, currentUser, loginMobileApp } = require("../../controllers/system/userController");
const validateToken = require("../../middleware/validateTokenHandler");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/current", validateToken, currentUser);

router.post("/login_mobile_app", loginMobileApp);

module.exports = router;