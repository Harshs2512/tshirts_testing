const express = require("express");
require("dotenv").config();
require("./db");
const userRoute = require("./routes/userRoute");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const productRoute = require("./routes/productRoute");
const commonRoute = require("./routes/commonRoute");
const topicRoute = require("./routes/topicRoute");
const categoryRoute = require("./routes/categoryRoute");
const paymentRoute = require("./routes/paymentRoute");
const orderRoute = require("./routes/orderRoute");
const cors = require('cors');
const path = require('path')


app.use(cors({
    origin: '*'
}));

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend/build')))

const errorMiddleware = require("./middleware/error");
app.use("/api/v1", userRoute);
app.use("/api/v1", productRoute);
app.use("/api/v1", commonRoute);
app.use("/api/v1", topicRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1", orderRoute);

app.get("/api/v1/getkey", (req, res) => {
    res.status(200).json({key: process.env.RAZORPAY_API_KEY})
})


app.use('*', function(req,res) {
    res.sendFile(path.join(__dirname, '../frontend/build'))
})
// Middleware for Error

app.use(errorMiddleware);
module.exports = app;

app.listen(8000, () => {
    console.log("the server is listening on port 8000");
}); 
