const express = require("express");
const router = express.Router();
const { getContact, createContact, updateContact, getContactById, deleteContact } = require("../../controllers/system/contactController");
const validateToken = require("../../middleware/validateTokenHandler");

router.use(validateToken);
router.route("/").get(getContact);
router.route("/").post(createContact);
router.route("/:id").get(getContactById);
router.route("/:id").put(updateContact);
router.route("/:id").delete(deleteContact);

module.exports = router;