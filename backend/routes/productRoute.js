const express = require('express');
const {
    getAllProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProductByCat_id,
    getSingleProduct,
    productPhoto,
    productFilters,
    searchProduct,
    searchProductByCat,
    realtedProduct

} = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const formidable = require('express-formidable')

const router = express.Router();


//For add course CRUD operation
router.route("/product/new").post(isAuthenticatedUser, authorizeRoles("admin"), formidable(), createProduct);
router.route("/products").get(getAllProduct);
router.route("/products/:slug").get(getSingleProduct);
router.route("/product/:pid").put(isAuthenticatedUser, authorizeRoles("admin"), formidable(), updateProduct).delete(isAuthenticatedUser, authorizeRoles("admin"), formidable(), deleteProduct)
router.route("/Showproduct/ByCate_id/:id").get(getAllProductByCat_id);
//get photo
router.get("/product-photo/:pid", productPhoto);

//filter product
router.post("/product-filters", productFilters);

//search product
router.get("/product/search/:keyword", searchProduct);

router.get("/search/category/:slug", searchProductByCat);

//similar product
router.get("/related-product/:pid/:cid", realtedProduct);



module.exports = router
