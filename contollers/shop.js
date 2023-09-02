import Order from '../models/order';
import Product from '../models/product';

import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

const stripe = require('stripe')(
  'sk_test_51NlqLhD58RdusyKWgfHjbKXcDc40DvZMSSM1GOXhZ8aC50oDi2bQ5YzHIbcjWwUoz3kw3K2aDVusEW2F84Lls49U004LbaQo35'
);

const PRODUCT_COUNT_FOR_PAGE = 2;

// const stripeWithKey = stripe(
//   'sk_test_51NlqLhD58RdusyKWgfHjbKXcDc40DvZMSSM1GOXhZ8aC50oDi2bQ5YzHIbcjWwUoz3kw3K2aDVusEW2F84Lls49U004LbaQo35'
// );

export const getCheckout = (req, res, next) => {
  let products;
  let total = 0;

  req.user
    .populate('cart.items.productId')
    .then(user => {
      products = [...user.cart.items].map(item => ({ ...item.productId._doc, quantity: item.quantity }));

      products.forEach(item => {
        total += item.quantity * item.price;
      });

      return stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: products.map(item => ({
          price_data: {
            currency: 'usd',
            unit_amount: item.price * 100,
            product_data: {
              name: item.title,
              description: item.description
            }
          },
          quantity: item.quantity
        })),
        mode: 'payment',
        success_url: req.protocol + '://' + req.get('host') + '/checkout/success',
        cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel'
      });
    })
    .then(session => {
      console.log('sesstion', session);
      res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout',
        products,
        totalSum: total,
        sessionId: session.id
      });
    })
    .catch(err => {
      console.log(err);
    });
};

export const getCheckoutSuccess = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items.map(item => ({
        quantity: item.quantity,
        product: item.productId._doc
      }));

      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user
        },
        products
      });

      return order.save();
    })
    .then(() => {
      return req.user.clearCart();
    })
    .then(result => {
      res.redirect('/orders');
    })
    .catch(err => {
      const error = new Error(err);
      err.statusCode = 500;
      return next(error);
    });
};

export const getIndex = (req, res) => {
  const page = Number(req.query.page) || 1;
  let totalItems;

  Product.find()
    .countDocuments()
    .then(numProducts => {
      totalItems = numProducts;

      return Product.find()
        .skip((page - 1) * PRODUCT_COUNT_FOR_PAGE)
        .limit(PRODUCT_COUNT_FOR_PAGE);
    })
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        currentPage: page,
        hasNextPage: PRODUCT_COUNT_FOR_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / PRODUCT_COUNT_FOR_PAGE)
      });
    })
    .catch(err => {
      console.log('Index fetch all err', err);
    });
};

export const getProducts = (req, res) => {
  const page = Number(req.query.page) || 1;

  let totalItems;
  console.log('req.query', req.query);
  console.log('page', page);
  Product.find()
    .countDocuments()
    .then(numProducts => {
      totalItems = numProducts;

      return Product.find()
        .skip((page - 1) * PRODUCT_COUNT_FOR_PAGE)
        .limit(PRODUCT_COUNT_FOR_PAGE);
    })
    .then(products => {
      console.log('products', products);
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All products ',
        path: '/products',
        currentPage: page,
        hasNextPage: PRODUCT_COUNT_FOR_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / PRODUCT_COUNT_FOR_PAGE)
      });
    })
    .catch(err => {
      console.log('Index fetch all err', err);
    });
};

export const getProduct = (req, res, next) => {
  const { productId } = req.params;
  Product.findById(productId)
    .then(product => {
      res.render('shop/product-detail', {
        product,
        path: '/products',
        pageTitle: product.title
      });
    })
    .catch(e => console.log(e));
};

export const getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items;

      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your cart',
        products
      });
    })
    .catch(err => {
      console.log(err);
    });
};

export const postCart = (req, res, next) => {
  const { productId } = req.body;

  Product.findById(productId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      res.redirect('/cart');
    });
};

export const postCartDeleteProduct = (req, res, next) => {
  const { productId } = req.body;

  req.user
    .removeFromCart(productId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => {
      const error = new Error(err);
      err.statusCode = 500;
      return next(error);
    });
};

export const getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your orders',
        orders
      });
    })
    .catch(err => {
      const error = new Error(err);
      err.statusCode = 500;
      return next(error);
    });
};

export const getOrderInvoice = (req, res, next) => {
  const { orderId } = req.params;

  Order.findById(orderId)
    .then(order => {
      if (!order) {
        return next(new Error('Order not found'));
      }

      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error('Unauthorized'));
      }

      const invoiceName = 'invoice-' + orderId + '.pdf';
      const invoicePath = path.join('data', 'invoices', invoiceName);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');

      const pdf = new PDFDocument();

      pdf.pipe(fs.createWriteStream(invoicePath));
      pdf.pipe(res);

      pdf.fontSize(20).text('Invoice # ' + order._id);
      pdf.text('------------------------------');
      pdf.fontSize(12);
      let index = 1;
      let totalPrice = 0;
      order.products.forEach(product => {
        const calculatedPrice = product.price * product.quantity;
        pdf.text(index + '. ' + product.title + ' - ' + product.quantity + ' - ' + calculatedPrice);
        totalPrice += calculatedPrice;
        index++;
      });
      pdf.text('------------------------------');
      pdf.fontSize(16).text('Total: ' + totalPrice);
      pdf.end();
    })
    .catch(err => {
      const error = new Error(err);
      err.httpStatusCode = 500;
      next(error);
    });
};

// export const postOrder = (req, res, next) => {
//   req.user
//     .populate('cart.items.productId')
//     .then(user => {
//       const products = user.cart.items.map(item => ({
//         quantity: item.quantity,
//         product: item.productId._doc
//       }));
//
//       const order = new Order({
//         user: {
//           email: req.user.email,
//           userId: req.user
//         },
//         products
//       });
//
//       return order.save();
//     })
//     .then(() => {
//       return req.user.clearCart();
//     })
//     .then(result => {
//       res.redirect('/orders');
//     })
//     .catch(err => {
//       const error = new Error(err);
//       err.statusCode = 500;
//       return next(error);
//     });
// };
