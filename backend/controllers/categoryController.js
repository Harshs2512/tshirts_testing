const Category = require("../models/categoryModel");
const { params } = require("../routes/categoryRoute");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHander = require("../utils/errorhander");
const slugify = require('slugify')


//for add category
exports.createCategory = catchAsyncErrors(async (req, res) => {
    try {
        const category_data = await Category.find();
        if (category_data.length > 0) {
            let checking = false;
            for (let i = 0; i < category_data.length; i++) {
                if (
                    category_data[i]["catName"].toLowerCase() === req.body.catName.toLowerCase()) {
                    checking = true;
                    break;
                }
            }
            if (checking == false) {
                const cat_data = await new Category({
                    catName: req.body.catName,
                    slug: slugify(req.body.catName),
                }).save();
                res.status(200)
                    .send({ success: true, message: "Successfully Added (" + req.body.catName + ") Ctegory", data: cat_data });
            } else {
                res.status(400).send({
                    success: false,
                    message: "this category(" + req.body.catName + ") is already exists",
                });
            }
        } else {
            const category = await Category.create(req.body);
            res.status(201).json({
                success: true,
                category,
            });
            const cat_data = await category.save();
            res
                .status(400)
                .send({ success: true, message: "Category Data", data: cat_data });
        }

        //category find end code
    } catch (error) {
        res.status(400).send({ success: false, msg: error.stack });
    }
});

// Gshow all  cetegory name
exports.getAllCategory = catchAsyncErrors(async (req, res) => {
    const categories = await Category.find();
    res.status(200).json({
        success: true,
        categories,
    });
});

// Update Category
exports.updateCategory = catchAsyncErrors(async (req, res) => {
    try {
        const category_data = await Category.find();
        if (category_data.length > 0) {
            let checking = false;
            for (let i = 0; i < category_data.length; i++) {
                if (
                    category_data[i]["catName"].toLowerCase() ===
                    req.body.catName.toLowerCase()
                ) {
                    checking = true;
                    break;
                }
            }
            if (checking == false) {
                const catName = await Category.updateMany(
                    {
                        _id: req.params.id,
                    },
                    {
                        catName: req.body.catName,
                        slug: req.body.catName,
                    }
                );
                res.status(200).send({
                    success: true,
                    message: "Successfully updated (" + req.body.catName + ") Ctegory",
                    data: catName,
                });
            } else {
                res.status(400).send({
                    success: false,
                    message: "this category(" + req.body.catName + ") is already exists",
                });
            }
        } else {
            const catName = await Category.updateMany(
                {
                    _id: req.params.id,
                },
                {
                    $set: req.body,
                }
            );
            res
                .status(400)
                .send({ success: true, message: "Category Data", data: cat_data });
        }
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
});

//delete  category
exports.deleteCategory = catchAsyncErrors(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        return next(new ErrorHander("category not found", 404));
    }

    const result = await Category.deleteOne({
        _id: req.params.id,
    });

    res.status(200).json({
        success: true,
        message: "Category Deleted Successfully",
        result
    });
});

//gat single category
exports.singleCategory = catchAsyncErrors(async (req, res) => {
    try {
        const category = await Category.findOne({ slug: req.params.slug });
        res.status(200).send({
            success: true,
            message: "Get SIngle Category SUccessfully",
            category,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error While getting Single Category",
        });
    }
});
