const Product = require("../models/product");
// const Cart = require("../models/cart");

exports.getProducts = (req, res) => {
  console.log("kjdhskfjdshakfhasdfjkahsjlkfhasndkcmmsdancjkasdhcjs --------");
  Product.fetchAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All products ",
        path: "/products",
      });
    })
    .catch((err) => {
      console.log("Index fetch all err", err);
    });
};

exports.getProduct = (req, res, next) => {
  const { productId } = req.params;
  Product.findById(productId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        path: "/products",
        pageTitle: product.title,
      });
    })
    .catch((e) => console.log(e));
};

exports.getIndex = (req, res) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      console.log("Index fetch all err", err);
    });
};

// exports.getCart = (req, res, next) => {
//   req.user
//     .getCart()
//     .then((cart) => {
//       return cart
//         .getProducts()
//         .then((products) => {
//
//           res.render("shop/cart", {
//             path: "/cart",
//             pageTitle: "Your cart",
//             products,
//           });
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };
//
// exports.postCart = (req, res, next) => {
//   const { productId } = req.body;
//   let fetchedCart;
//   let newQuantity = 1;
//
//   req.user
//     .getCart()
//     .then((cart) => {
//       fetchedCart = cart;
//       return cart.getProducts({ where: { id: productId } });
//     })
//     .then((products) => {
//       let product;
//       if (products.length > 0) {
//         product = products[0];
//       }
//
//       if (product) {
//         const oldQuantity = product.cartItem.quantity;
//         newQuantity = oldQuantity + 1;
//         return product;
//       }
//
//       return Product.findByPk(productId);
//     })
//     .then((product) => {
//       return fetchedCart.addProduct(product, {
//         through: { quantity: newQuantity },
//       });
//     })
//     .then(() => {
//       res.redirect("/cart");
//     })
//     .catch((err) => {
//       console.log(err);
//     });
//
//   res.redirect("/");
// };
//
// exports.postCartDeleteProduct = (req, res, next) => {
//   const { productId } = req.body;
//
//   req.user
//     .getCart()
//     .then((cart) => {
//       return cart.getProducts({ where: { id: productId } });
//     })
//     .then((products) => {
//       const [product] = products;
//       return product.cartItem.destroy();
//     })
//     .then((result) => {
//       res.redirect("/cart");
//     })
//     .catch((err) => console.log(err));
// };
//
// exports.postOrder = (req, res, next) => {
//   let fetchedCart;
//
//   req.user
//     .getCart()
//     .then((cart) => {
//       fetchedCart = cart;
//       return cart.getProducts();
//     })
//     .then((products) => {
//       return req.user
//         .createOrder()
//         .then((order) => {
//           return order.addProducts(
//             products.map((product) => {
//               product.orderItem = { quantity: product.cartItem.quantity };
//               return product;
//             })
//           );
//         })
//         .catch((err) => console.log(err));
//     })
//     .then(() => {
//       return fetchedCart.setProducts(null);
//     })
//     .then((result) => {
//       res.redirect("/orders");
//     })
//     .catch((err) => console.log(err));
// };
//
// exports.getOrders = (req, res, next) => {
//   req.user
//     .getOrders({ include: ["products"] })
//     .then((orders) => {
//       res.render("shop/orders", {
//         path: "/orders",
//         pageTitle: "Your orders",
//         orders,
//       });
//     })
//     .catch((err) => console.log(err));
// };

// exports.getCheckout = (req, res, next) => {
//   res.render("shop/checkout", {
//     path: "/checkout",
//     pageTitle: "Checkout",
//   });
// };
