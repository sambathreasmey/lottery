const express = require("express");
const router = express.Router();
const validateToken = require("../../app/middleware/validateTokenHandler");
const { getAllPost, createPost, getPostById, deletePostById, updatePostById, getAllSchedule, getScheduleById, createSchedule, deleteScheduleById, updateScheduleById } = require("./shortcutController");

router.use(validateToken);
//post
router.route('/post/').get(getAllPost);
router.route('/post/:id').get(getPostById);
router.route('/post/').post(createPost);
router.route('/post/:id').delete(deletePostById);
router.route("/post/:id").put(updatePostById);
//schedule
router.route('/schedule/').get(getAllSchedule);
router.route('/schedule/:id').get(getScheduleById);
router.route('/schedule/').post(createSchedule);
router.route('/schedule/:id').delete(deleteScheduleById);
router.route("/schedule/:id").put(updateScheduleById);

module.exports = router;