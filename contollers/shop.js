const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res) => {
  Product.fetchAlL((products) => {
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All products ",
      path: "/products",
    });
  });
};

exports.getProduct = (req, res, next) => {
  const { productId } = req.params;
  Product.findById(productId, (product) => {
    res.render("shop/product-detail", {
      product,
      path: "/products",
      pageTitle: product.title,
    });
  });
};

exports.getIndex = (req, res) => {
  Product.fetchAlL((products) => {
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  });
};

exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    Product.fetchAlL((products) => {
      const cartProducts = [];
      for (product of products) {
        const cartProductData = cart.products.find(
          (item) => item.id === product.id
        );

        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }

      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your cart",
        cart: {
          products: cartProducts,
          totalPrice: cart.totalPrice,
        },
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId, ({ price }) => {
    Cart.addProduct(productId, price);
  });
  res.redirect("/");
};

exports.postCartDeleteProduct = (req, res, next) => {
  const { productId, productPrice } = req.body;

  Cart.deleteProduct(productId, productPrice);

  res.redirect("/cart");
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your orders",
  });
};

exports.getCheckput = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
