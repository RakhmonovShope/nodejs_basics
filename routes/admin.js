import * as adminController from '../contollers/admin';
import isAuth from '../middleware/is-auth';

import express from 'express';
import { body } from 'express-validator';

const router = express.Router();
// get routes

router.get('/add-product', isAuth, adminController.getAddProduct);
router.get('/products', adminController.getProducts);
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);
//
// // post routes
router.post(
  '/add-product',
  isAuth,
  [
    body('title').isString().isLength({ min: 3, max: 25 }).withMessage('title can has to be 3 to 25 characters long'),
    body('imageUrl').isURL().withMessage('please provide a valid url for image'),
    body('price').isFloat(),
    body('description')
      .isLength({ min: 5, max: 200 })
      .withMessage('description should be between 5 to 200 characters')
      .isString()
      .trim()
  ],

  adminController.postAddProducts
);
router.post('/delete-product', isAuth, adminController.postDeleteProduct);
router.post(
  '/edit-product',
  isAuth,
  [
    body('title').isString().isLength({ min: 3, max: 25 }).withMessage('title can has to be 3 to 25 characters long'),
    body('imageUrl').isURL().withMessage('please provide a valid url for image'),
    body('price').isFloat(),
    body('description')
      .isLength({ min: 5, max: 200 })
      .withMessage('description should be between 5 to 200 characters')
      .isString()
      .trim()
  ],
  adminController.postEditProduct
);

module.exports = router;
