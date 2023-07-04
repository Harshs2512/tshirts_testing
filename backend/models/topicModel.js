const mongoose = require("mongoose");

const topicSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    discreption: {
        type: String,
        required: [true, " enter Description"]
    },
    lessonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Lesson",
        required: [true, "Please lesson Id......!"]
    },
    videos: [{ type: String }],

});



module.exports = mongoose.model("Topic", topicSchema);