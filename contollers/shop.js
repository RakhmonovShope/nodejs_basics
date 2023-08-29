import Order from '../models/order';
import Product from '../models/product';

const getProducts = (req, res) => {
  Product.find()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All products ',
        path: '/products'
      });
    })
    .catch(err => {
      console.log('Index fetch all err', err);
    });
};

const getProduct = (req, res, next) => {
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

const getIndex = (req, res) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => {
      console.log('Index fetch all err', err);
    });
};

const getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items;

      console.log(products);
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

const postCart = (req, res, next) => {
  const { productId } = req.body;

  Product.findById(productId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      res.redirect('/cart');
    });
  // let fetchedCart;
  // let newQuantity = 1;
  //
  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     fetchedCart = cart;
  //     return cart.getProducts({ where: { id: productId } });
  //   })
  //   .then((products) => {
  //     let product;
  //     if (products.length > 0) {
  //       product = products[0];
  //     }
  //
  //     if (product) {
  //       const oldQuantity = product.cartItem.quantity;
  //       newQuantity = oldQuantity + 1;
  //       return product;
  //     }
  //
  //     return Product.findByPk(productId);
  //   })
  //   .then((product) => {
  //     return fetchedCart.addProduct(product, {
  //       through: { quantity: newQuantity },
  //     });
  //   })
  //   .then(() => {
  //     res.redirect("/cart");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  //
  // res.redirect("/");
};

const postCartDeleteProduct = (req, res, next) => {
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

const postOrder = (req, res, next) => {
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

const getOrders = (req, res, next) => {
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

export { getCart, getIndex, getOrders, getProduct, getProducts, postCart, postCartDeleteProduct, postOrder };
