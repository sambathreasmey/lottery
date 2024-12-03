const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");
const { getAllGroupMember, getGroupMemberById, createGroupMember, deleteGroupMember, updateGroupMember } = require("../controllers/groupMemberController");

router.use(validateToken);
router.route("/").get(getAllGroupMember);
router.route("/:id").get(getGroupMemberById);
router.route("/").post(createGroupMember);
router.route("/:id").delete(deleteGroupMember);
router.route("/:id").put(updateGroupMember);

module.exports = router;