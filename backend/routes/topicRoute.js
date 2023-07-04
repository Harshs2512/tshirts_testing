const express = require('express');
const {createTopic, AllTopicsByLessonId} = require("../controllers/topicControllers");
const router = express.Router();
//For add course CRUD operation
router.route("/topic/new").post(createTopic);
// router.route("/courses").get(getAllCourses);
router.route("/topic/:id").get(AllTopicsByLessonId);
// router.route("/Showcourse/ByCate_id/:id").get( getAllCoursesByCat_id);


module.exports = router