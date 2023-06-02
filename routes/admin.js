const express = require("express");

const router = express.Router();
const adminController = require("../contollers/admin");

// get routes
router.get("/product-create", adminController.getAllProduct);
router.get("/product");

// post routes
router.post("/product", adminController.postAddProducts);

module.exports = router;
