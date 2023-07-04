const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
    selling_price: {
        type: Number,
        required: [true, "Please Enter Selling Price"]
    },
    discounted_price: {
        type: Number,
        required: [true, "Please Enter Discounted Price"]
    },
    description: {
        type: String,
        required: [true, "Please Enter Description"]
    },
    size: [{
        type: String,
    }],
    color: {
        type: String,
        required: [true, "Please Enter Color"],
    },
    category: {
        type: mongoose.ObjectId,
        ref: "Category",
        required: [true, "Please enter category"]
    },
    rating: {
        type: Number,
        default: 0,
    },
    quantity: {
        type: Number,
        required: true,
        default: 0,
    },
    photo: {
        data: Buffer,
        contentType: String,
    },
    shipping: {
        type: Boolean,
    },
},
    { timestamps: true }
);



module.exports = mongoose.model("Product", productSchema);