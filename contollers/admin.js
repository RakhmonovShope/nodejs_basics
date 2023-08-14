const Product = require("../models/product");
const { ObjectId } = require("mongodb");

exports.getAddProduct = (req, res) => {
  res.render("admin/edit-product", {
    pageTitle: "Product Add",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProducts = (req, res) => {
  const { imageUrl, title, description, price } = req.body;
  const product = new Product(title, imageUrl, price, description);
  return product
    .save()
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin products ",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      console.log("Admin get products err", err);
    });
};

exports.getEditProduct = (req, res) => {
  const { productId } = req.params;
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect("/");
  }

  Product.findById(productId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }

      res.render("admin/edit-product", {
        pageTitle: "Product Edit",
        path: "/admin/edit-product",
        editing: true,
        product,
      });
    })
    .catch((err) => {
      console.log("Admin get edit product err", err);
    });
};

exports.postEditProduct = (req, res) => {
  const { id, title, imageUrl, description, price } = req.body;
  const product = new Product(title, imageUrl, price, description, id);

  product
    .save()
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.log("Admin post edit product", err));
};

exports.postDeleteProduct = (req, res) => {
  const { productId } = req.body;

  Product.deleteById(productId)
    .then(() => {
      console.log("Product deleted!");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log("Admin product delete err", err));
};

// exports.getAllProduct = (req, res) => {
//   res.render("admin/edit-product", {
//     pageTitle: "Edit Product",
//     path: "/admin/edit-product",
//   });
// };
