const Product = require("../models/product");

exports.getAllProduct = (req, res) => {
  res.render("admin/add-product", {
    pageTitle: "Product Adddsad",
    path: "/admin/product-create",
    productCss: true,
    formCss: true,
    productPage: true,
  });
};

exports.postAddProducts = (req, res) => {
  const { imageUrl, title, description, price } = req.body;
  const product = new Product(title, imageUrl, description, price);

  product.save();
  res.redirect("/");
};

exports.getProducts = (req, res, next) => {
  Product.fetchAlL((products) => {
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin products ",
      path: "/admin/products",
    });
  });
};
