const mongoose = require('mongoose');
const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const { params } = require("../routes/productRoute");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHander = require("../utils/errorhander");
const fs = require('fs')
const slugify = require('slugify')


//For admin create course
exports.createProduct = catchAsyncErrors(async (req, res) => {
    try {
        const { title, description, selling_price, discounted_price, size, color, category, quantity } =
            req.fields;
        const { photo } = req.files;
        //alidation
        switch (true) {
            case !title:
                return res.status(500).send({ error: "Title is Required" });
            case !description:
                return res.status(500).send({ error: "Description is Required" });
            case !selling_price:
                return res.status(500).send({ error: "Selling price is Required" });
            case !discounted_price:
                return res.status(500).send({ error: "Discounted Price price is Required" });
            case !category:
                return res.status(500).send({ error: "Category is Required" });
            case !quantity:
                return res.status(500).send({ error: "Quantity is Required" });
            case !size:
                return res.status(500).send({ error: "Size is Required" });
            case !color:
                return res.status(500).send({ error: "Color is Required" });

            case photo && photo.size > 10000000:
                return res
                    .status(500)
                    .send({ error: "photo is Required and should be less then 1mb" });
        }

        const products = new Product({ ...req.fields, slug: slugify(title) });
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
            success: true,
            message: "Product Created Successfully",
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in crearing product",
        });
    }
});

//get all products
exports.getAllProduct = catchAsyncErrors(async (req, res) => {
    try {
        const products = await Product
            .find({})
            .populate("category")
            .select("-photo")
            .sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            counTotal: products.length,
            message: "ALlProducts ",
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Erorr in getting products",
            error: error.message,
        });
    }
});

//upate producta
exports.updateProduct = catchAsyncErrors(async (req, res) => {
    try {
        const { title, description, selling_price, discounted_price, size, color, category, quantity } =
            req.fields;
        const { photo } = req.files;

        // Validation
        const requiredFields = ["title", "description", "selling_price", "discounted_price", "size", "color", "category", "quantity"];
        const missingFields = requiredFields.filter(field => !req.fields[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({ error: `Missing required fields: ${missingFields.join(", ")}` });
        }

        if (photo && photo.size > 1000000) {
            return res.status(400).json({ error: "Photo is required and should be less than 1MB" });
        }

        const updatedProduct = {
            title,
            description,
            selling_price,
            discounted_price,
            size,
            color,
            category,
            quantity,
            slug: slugify(title)
        };

        const product = await Product.findByIdAndUpdate(
            req.params.pid,
            updatedProduct,
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        if (photo) {
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type;
            await product.save();
        }

        res.status(200).json({
            success: true,
            message: "Product Updated Successfully",
            product,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: "Error in updating product",
        });
    }
});

//delete controller
exports.deleteProduct = catchAsyncErrors(async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.pid).select("-photo");
        res.status(200).send({
            success: true,
            message: "Product Deleted successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while deleting product",
            error,
        });
    }
});

/// get single product
exports.getSingleProduct = catchAsyncErrors(async (req, res) => {
    try {
        const product = await Product
            .findOne({ slug: req.params.slug })
            .select("-photo")
            .populate("category");
        res.status(200).send({
            success: true,
            message: "Single Product Fetched",
            product,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Eror while getitng single product",
            error,
        });
    }
});

//show all course by category id
exports.getAllProductByCat_id = catchAsyncErrors(async (req, res) => {
    const result = await Product.find({ category: req.params.id }).populate('category', 'catName');
    res.status(200).json({
        success: true,
        result
    })
});

// get photo
exports.productPhoto = catchAsyncErrors(async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid).select("photo");
        if (product.photo.data) {
            res.set("Content-type", product.photo.contentType);
            return res.status(200).send(product.photo.data);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Erorr while getting photo",
            error,
        });
    }
});

// filters
exports.productFilters = async (req, res) => {
    try {
        const { checked, radio, selectedColors, selectedSizes } = req.body;
        let args = {};

        if (checked.length > 0) {
            const categoryIds = checked.filter(category => mongoose.Types.ObjectId.isValid(category));
            if (categoryIds.length > 0) {
                args.category = { $in: categoryIds };
            } else {
                delete args.category; // Remove the category filter from args
            }
        }

        if (selectedColors.length > 0) args.color = selectedColors;
        
        if (selectedSizes.length > 0) args.size = { $in: selectedSizes };

        if (radio.length) args.selling_price = { $gte: radio[0], $lte: radio[1] };

        const products = await Product.find(args).populate("category");
        res.status(200).send({
            success: true,
            products,
        });
        // console.log("gjgjgjjkhkjhkjhj",products)
        console.log("gj", args)
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error while filtering products",
            error,
        });
    }
};




// search product
exports.searchProduct = catchAsyncErrors(async (req, res) => {
    try {
        const { keyword } = req.params;
        const resutls = await Product
            .find({
                $or: [
                    { title: { $regex: keyword, $options: "i" } },
                    { description: { $regex: keyword, $options: "i" } },
                ],
            })
            .populate('category')
        res.json(resutls);
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error In Search Product API",
            error,
        });
    }
});

exports.searchProductByCat = catchAsyncErrors(async (req, res) => {
    try {
        const category = await Category.findOne({ slug: req.params.slug });
        const products = await Product.find({ category }).populate("category");
        res.status(200).send({
            success: true,
            category,
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            error,
            message: "Error While Getting products",
        });
    }
});

// similar products
exports.realtedProduct = async (req, res) => {
    try {
        const { pid, cid } = req.params;
        const products = await Product
            .find({
                category: cid,
                _id: { $ne: pid },
            })
            .select("-photo")
            .limit(10)
            .populate("category");
        res.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "error while geting related product",
            error,
        });
    }
};