const express = require('express');
const {
    order,
    getAllOrder,
    getAllUserOrder,
    orderStatus,
} = require("../controllers/orderControllers");

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();


router.route("/order").post(order);
router.route("/allorder").get(getAllOrder);
router.route("/myorders/:userId").get(getAllUserOrder);
router.route("/myorders/status/:orderId").put(orderStatus);


module.exports = router;