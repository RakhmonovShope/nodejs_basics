import Product from '../models/product';

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

export const postAddProducts = (req, res) => {
  const { imageUrl, title, description, price } = req.body;

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
        imageUrl,
        price,
        description
      },
      validationErrors: errors.array()
    });
  }

  const product = new Product({
    title,
    imageUrl,
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
      console.log(err);
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
      console.log('Admin get products err', err);
    });
};

export const getEditProduct = (req, res) => {
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
      console.log('Admin get edit product err', err);
    });
};

export const postEditProduct = (req, res) => {
  const { id, title, imageUrl, description, price } = req.body;

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
        imageUrl,
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
      product.imageUrl = imageUrl;
      product.description = description;
      product.price = price;

      return product.save().then(() => {
        res.redirect('/admin/products');
      });
    })
    .catch(err => console.log('Admin post edit product', err));
};

export const postDeleteProduct = (req, res) => {
  const { productId } = req.body;

  Product.deleteOne({ _id: productId, userId: req.user._id })
    .then(() => {
      console.log('Product deleted!');
      res.redirect('/admin/products');
    })
    .catch(err => console.log('Admin product delete err', err));
};
