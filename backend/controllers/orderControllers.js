const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Order = require("../models/orderModel");
// const User = require("../models/userModel");
const crypto = require("crypto");


exports.order = catchAsyncErrors(async (req, res, next) => {
    const { products, payment, user, status } = req.body;

    const orderdone = await Order.create({
        products,
        payment,
        user,
        status
    });
    res.status(200).json({
        success: true,
        orderdone,
    });
});


// Get all User Order
exports.getAllOrder = async (req, res) => {
    const orders = await Order.find().populate("user").populate("products", "-photo");
    res.status(200).json({
        success: true,
        orders,
    });
};


// Get all Order By User Id
//orders
exports.getAllUserOrder = async (req, res) => {
    try {
        const orders = await Order
            .find({ user: req.params.userId })
            .populate({
                path: "products",
                populate: {
                    path: "category",
                    select: "catName",
                },
                select: "-photo",
            })
            .populate("user", "name");
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error WHile Geting Orders",
            error,
        });
    }
};

//order status
exports.orderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const orders = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error While Updateing Order",
            error,
        });
    }
};