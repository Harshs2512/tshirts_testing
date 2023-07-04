const mongoose = require("mongoose");

const lessonSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    discreption: {
        type: String,
        required: [true, "Please Enter Category"]
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Course",
        required: [true, "Please Enter Category"]
    },
    thumnail_img: [{
        type: String,
        require: true
    }],
    videos: { type: String },

});



module.exports = mongoose.model("Lesson", lessonSchema);