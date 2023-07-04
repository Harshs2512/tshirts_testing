const express = require('express');
const {
    createCategory,
    getAllCategory,
    updateCategory,
    deleteCategory,
    singleCategory,
} = require("../controllers/categoryController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

//For add category CRUD operation
router.route("/add_category").post(isAuthenticatedUser, authorizeRoles("admin"), createCategory);
router.route("/show_category").get(getAllCategory);
router.route("/single_category/:slug").get(singleCategory);
router.route("/category/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateCategory).delete(isAuthenticatedUser, authorizeRoles("admin"), deleteCategory);

module.exports = router
