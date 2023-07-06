const Product = require("../models/product");

exports.getAddProduct = (req, res) => {
  res.render("admin/edit-product", {
    pageTitle: "Product Add",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProducts = (req, res) => {
  const { imageUrl, title, description, price } = req.body;
  const product = new Product(null, title, imageUrl, description, price);

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

exports.getEditProduct = (req, res) => {
  const { productId } = req.params;
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect("/");
  }

  Product.findById(productId, (product) => {
    if (!product) {
      return res.redirect("/");
    }

    res.render("admin/edit-product", {
      pageTitle: "Product Edit",
      path: "/admin/edit-product",
      editing: true,
      product,
    });
  });
};

exports.postEditProduct = (req, res) => {
  const { id, title, imageUrl, description, price } = req.body;

  const product = new Product(id, title, imageUrl, description, price);

  product.save();
  res.redirect("/admin/products");
};

exports.postDeleteProduct = (req, res) => {
  Product.deleteById(req.body.productId);

  res.redirect("/admin/products");
};

exports.getAllProduct = (req, res) => {
  res.render("admin/edit-product", {
    pageTitle: "Edit Product",
    path: "/admin/edit-product",
  });
};
