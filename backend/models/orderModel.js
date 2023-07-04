const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, "Category is required"],
  },
  color: {
    type: String,
    required: [true, "Color is required"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
  },
  size: {
    type: String,
    required: [true, "Size is required"],
  },
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  _id: {
    type: String,
    required: [true, "Product ID is required"],
  },
});

const orderSchema = new mongoose.Schema(
  {
    products: [productSchema],
    payment: {},

    user:
    {
      type: mongoose.ObjectId,
      ref: "User",
    }
    ,
    status: {
      type: String,
      default: "Under Process",
      enum: ["Under Process", "Processing", "Shipped", "deliverd", "cancel"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
