import * as adminController from "../contollers/admin";
import isAuth from "../middleware/is-auth";

import express from 'express';

const router = express.Router();
// get routes

router.get("/add-product", isAuth, adminController.getAddProduct);
router.get("/products", adminController.getProducts);
router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);
//
// // post routes
router.post("/add-product", isAuth, adminController.postAddProducts);
router.post("/delete-product", isAuth, adminController.postDeleteProduct);
router.post("/edit-product", isAuth, adminController.postEditProduct);

module.exports = router;
