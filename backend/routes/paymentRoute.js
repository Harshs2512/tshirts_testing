const express = require('express');
const { createOrder, cardDetail } = require("../controllers/paymentController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const formidable = require('express-formidable')
const router = express.Router();


router.route("/create").post(createOrder);
router.route("/cart-detail").get(isAuthenticatedUser, cardDetail);



module.exports = router