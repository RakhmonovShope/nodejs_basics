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
  req.user
    .createProduct({
      imageUrl,
      description,
      title,
      price,
    })
    .then((result) => {
      console.log("Product created");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  req.user
    .getProducts()
    .then((products) => {
      console.log("products", products);
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

  req.user
    .getProducts({
      where: {
        id: productId,
      },
    })

    .then((products) => {
      const [product] = products;
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

  Product.findByPk(id)
    .then((product) => {
      product.title = title;
      product.imageUrl = imageUrl;
      product.description = description;
      product.price = price;
      return product.save();
    })
    .then(() => {
      console.log("Product updated!");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log("Admin post edit product", err));
};

exports.postDeleteProduct = (req, res) => {
  Product.findByPk(req.body.productId)
    .then((product) => {
      product.destroy();
    })
    .then(() => {
      console.log("Product deleted!");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log("Admin product delete err", err));
};

exports.getAllProduct = (req, res) => {
  res.render("admin/edit-product", {
    pageTitle: "Edit Product",
    path: "/admin/edit-product",
  });
};
