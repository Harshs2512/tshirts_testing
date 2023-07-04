const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
//all models for data counted
const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const Lesson = require("../models/lessonModel");
const User = require("../models/userModel");

///+++++++++++++++++++++++++++++++



// // count data code
exports.countData = catchAsyncErrors(async (req, res, next) => {
    try {
        const count_data = [];
        const course_data = await Product.find().count();
        const category_data = await Category.find().count();
        const user_data = await User.find({ role: "user" }).count();
        const admin_data = await User.find({ role: "admin" }).count();

        count_data.push({
            product: course_data,
            category: category_data,
            user: user_data,
            admin: admin_data,
        })

        res.status(200).send({
            success: true,
            message: "succesfully counted data", count_data
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            message: error.message
        });
    }
});

// // count data code
exports.LessonData = catchAsyncErrors(async (req, res, next) => {
    try {
        const count_data = [];
        const lessonCount = await Lesson.find({ courseId: req.params.id }).count();
        // const lessonCount1 = lessonCount.count()

        count_data.push({
            lessonCountData: lessonCount
        })

        res.status(200).send({
            success: true,
            message: "succesfully counted data", count_data
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            message: error.message
        });
    }
});