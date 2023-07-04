const Razorpay = require('razorpay');
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

exports.createOrder = catchAsyncErrors(async (req, res) => {
    try {
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_API_KEY,
            key_secret: process.env.RAZORPAY_API_SECRET,
        })
        const { order_id, amount, payment_capture, currency } = req.body;
        const options = {
            amount: Number(amount * 100),
            currency: currency,
            receipt: order_id,
            payment_capture
        }
        const order = await instance.orders.create(options);
        if (!order) return res.status(500).send("something wrong")
        res.status(200).send({
            success: true,
            order,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            error,
            message: "Error While Getting payment",
        });
    }
});


exports.cardDetail = catchAsyncErrors(async (req, res) => {
    try {
        const instance = new Razorpay({
            key_id: 'rzp_test_WFiTf1UcDonIaA',
            key_secret: 'zPqutShh96BQ1uD1S3Mzs5nH',
        })
        const { id } = req.body;
        console.log(instance.payments.fetch)
        const order = await instance.payments.fetch(id);
        if (!order) return res.status(500).send("something wrong")
        res.status(200).send({
            success: true,
            order,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error While Getting payment",
        });
    }
});