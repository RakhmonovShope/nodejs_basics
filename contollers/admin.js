import Product from '../models/product';
import * as fileHelpers from '../utils/file';

import { validationResult } from 'express-validator/check';

export const getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Product Add',
    path: '/admin/add-product',
    editing: false,
    errorMessage: null,
    validationErrors: []
  });
};

export const postAddProducts = (req, res, next) => {
  const { title, description, price } = req.body;
  const image = req.file;

  console.log('images', image);

  if (!image) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      errorMessage: 'Attached file is not image',
      product: {
        title,
        price,
        description
      },
      validationErrors: []
    });
  }

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const { msg } = errors.array()[0];

    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      errorMessage: msg || null,
      product: {
        title,
        imageUrl: image,
        price,
        description
      },
      validationErrors: errors.array()
    });
  }

  const product = new Product({
    title,
    imageUrl: image.path,
    price,
    description,
    userId: req.session.user._id
  });

  product
    .save()
    .then(result => {
      res.redirect('/admin/products');
    })
    .catch(err => {
      const error = new Error(err);
      err.statusCode = 500;
      return next(error);
    });
};

export const getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin products ',
        path: '/admin/products'
      });
    })
    .catch(err => {
      const error = new Error(err);
      err.statusCode = 500;
      return next(error);
    });
};

export const getEditProduct = (req, res, next) => {
  const { productId } = req.params;
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect('/');
  }

  Product.findById(productId)
    .then(product => {
      if (!product || product.userId.toString() !== req.user._id.toString()) {
        req.flash('alert', 'You can not edit this product information.');
        res.redirect('/admin/products');
      } else {
        res.render('admin/edit-product', {
          pageTitle: product.title,
          path: '/admin/products',
          editing: editMode,
          product,
          errorMessage: null,
          validationErrors: []
        });
      }
    })
    .catch(err => {
      const error = new Error(err);
      err.statusCode = 500;
      return next(error);
    });
};

export const postEditProduct = (req, res, next) => {
  const { id, title, description, price } = req.body;

  const image = req.file;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const { msg } = errors.array()[0];

    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/products',
      editing: true,
      errorMessage: msg || null,
      product: {
        _id: id,
        title,
        price,
        description
      },
      validationErrors: errors.array()
    });
  }

  Product.findById(id)
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/admin/products');
      }

      product.title = title;
      if (image) {
        fileHelpers.deleteFile(product.imageUrl);
        product.imageUrl = image.path;
      }
      product.description = description;
      product.price = price;

      return product.save().then(() => {
        res.redirect('/admin/products');
      });
    })
    .catch(err => {
      const error = new Error(err);
      err.statusCode = 500;
      return next(error);
    });
};

export const deleteProduct = (req, res, next) => {
  const productId = req.params.productId;

  Product.findById(productId)
    .then(product => {
      if (!product) {
        return next(new Error('Product not found.'));
      }

      fileHelpers.deleteFile(product.imageUrl);
      return Product.deleteOne({ _id: productId, userId: req.user._id });
    })
    .then(() => {
      res.status(200).json({ message: 'Deleted successfully!' });
    })
    .catch(() => {
      res.status(500).json({ message: 'Deleting product failed' });
    });
};
