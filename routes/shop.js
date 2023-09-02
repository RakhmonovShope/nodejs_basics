import * as shopController from '../contollers/shop';
import isAuth from '../middleware/is-auth';

import express from 'express';

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);
router.get('/products/:productId', shopController.getProduct);
router.get('/cart', isAuth, shopController.getCart);
router.get('/checkout', isAuth, shopController.getCheckout);
router.get('/checkout/cancel', shopController.getCheckout);
router.get('/checkout/success', shopController.getCheckoutSuccess);

router.post('/cart', isAuth, shopController.postCart);
router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);
// router.post('/create-order', isAuth, shopController.postOrder);
router.get('/orders', isAuth, shopController.getOrders);
router.get('/orders/:orderId', isAuth, shopController.getOrderInvoice);

module.exports = router;
