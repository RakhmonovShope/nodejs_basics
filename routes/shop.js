const express = require("express");
const router = express.Router();
const shopController = require("../contollers/shop");

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);
router.get("/cart", shopController.getCart);
router.get("/checkout", shopController.getCheckput);

module.exports = router;
