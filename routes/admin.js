import * as adminController from '../contollers/admin';
import isAuth from '../middleware/is-auth';

import express from 'express';
import { body } from 'express-validator';

const router = express.Router();

router.get('/add-product', isAuth, adminController.getAddProduct);
router.get('/products', adminController.getProducts);
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post(
  '/add-product',
  isAuth,
  [
    body('title').isString().isLength({ min: 3, max: 70 }).withMessage('title can has to be 3 to 70 characters long'),
    body('price').isFloat(),
    body('description')
      .isLength({ min: 5, max: 200 })
      .withMessage('description should be between 5 to 200 characters')
      .isString()
      .trim()
  ],

  adminController.postAddProducts
);

router.post(
  '/edit-product',
  isAuth,
  [
    body('title').isString().isLength({ min: 3, max: 25 }).withMessage('title can has to be 3 to 25 characters long'),
    body('price').isFloat(),
    body('description')
      .isLength({ min: 5, max: 200 })
      .withMessage('description should be between 5 to 200 characters')
      .isString()
      .trim()
  ],
  adminController.postEditProduct
);

router.delete('/delete-product/:productId', isAuth, adminController.deleteProduct);

module.exports = router;
