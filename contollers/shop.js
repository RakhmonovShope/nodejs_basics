const Product = require("../models/product");

exports.getProducts = (req, res) => {
  Product.fetchAlL((products) => {
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All products ",
      path: "/products",
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
  res.render("shop/cart", {
    path: "/cart",
    pageTitle: "Your cart",
  });
};

exports.getCheckput = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
