const Topic = require("../models/topicModel");
const Lesson = require("../models/lessonModel");
const { params } = require("../routes/productRoute");
// const catchAsyncErrors = require("../middleware/catchAsyncErrors");
// const ErrorHander = require("../utils/errorhander");


// Create Topic
exports.createTopic = (async (req, res, next) => {
    try {
        const topic = await Topic.find();
        if (topic.length > 0) {
            let checking = false;
            for (let i = 0; i < topic.length; i++) {
                if (
                    topic[i]["title"].toLowerCase() === req.body.title.toLowerCase()) {
                    checking = true;
                    break;
                }
            }
            if (checking == false) {
                const title = new Topic(req.body);
                const topic_data = await title.save();
                res
                    .status(200)
                    .send({ success: true, message: "Successfully Added (" + req.body.title + ") lesson", data: topic_data });
            } else {
                res.status(400).send({
                    success: false,
                    message: "this topic(" + req.body.title + ") is already exists",
                });
            }
        } else {
            const topic = await Topic.create({
                title: req.body.title,
                lessonId: req.body.lessonId,
                discreption: req.body.discreption,
            });
            res.status(201).json({
                success: true,
                topic,
            });
            const topic_data = await Topic.save();
            res.status(400).send({ success: true, message: "lesson Data", data: topic_data });
        }
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
});

// Create Topic
exports.AllTopicsByLessonId = (async (req, res, next) => {
    try {
        const topic = await Topic.find({ lessonId: req.params.id });
        res.status(200).send({ success: true, topic });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
});

