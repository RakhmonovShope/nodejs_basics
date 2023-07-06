const express = require("express");
const router = express.Router();
const shopController = require("../contollers/shop");

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);
router.get("/products/:productId", shopController.getProduct);
router.get("/cart", shopController.getCart);

router.post("/cart", shopController.postCart);
router.post("/cart-delete-item", shopController.postCartDeleteProduct);
router.get("/checkout", shopController.getCheckput);
router.get("/orders", shopController.getOrders);

module.exports = router;
