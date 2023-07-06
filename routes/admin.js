const express = require("express");

const router = express.Router();
const adminController = require("../contollers/admin");

// get routes

router.get("/add-product", adminController.getAddProduct);
router.get("/products", adminController.getProducts);
router.get("/edit-product/:productId", adminController.getEditProduct);

// post routes
router.post("/add-product", adminController.postAddProducts);
router.post("/delete-product", adminController.postDeleteProduct);
router.post("/edit-product", adminController.postEditProduct);

module.exports = router;
