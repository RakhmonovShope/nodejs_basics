const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return cp.productId.toString() === product._id.toString();
  });
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity,
    });
  }

  const updatedCart = {
    items: updatedCartItems,
  };

  this.cart = updatedCart;

  return this.save();
};

userSchema.methods.removeFromCart = function (productId) {
  const updatedItems = this.cart.items.filter(
    (item) => item.productId.toString() !== productId.toString()
  );

  this.cart.items = updatedItems;

  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart.items = [];

  return this.save();
};

module.exports = model("User", userSchema);

// const { ObjectId } = require("mongodb");
// const { getDb } = require("../utils/database");
//
// class User {
//   constructor(name, email, cart, id) {
//     this.name = name;
//     this.email = email;
//     this.cart = cart;
//     this._id = id;
//   }
//
//   save() {
//     const db = getDb();
//
//     return db.collection("users").insertOne(this);
//   }
//

//   getCart() {
//     const db = getDb();
//
//     const productIds = this.cart.items.map((item) => item.productId);
//
//     return db
//       .collection("products")
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then((products) =>
//         products.map((product) => ({
//           ...product,
//           quantity: this.cart.items.find(
//             (cart) => cart.productId.toString() === product._id.toString()
//           ).quantity,
//         }))
//       );
//   }
//
//   deleteItemFromCart(productId) {
//     const db = getDb();
//
//     const updatedItems = this.cart.items.filter(
//       (item) => item.productId.toString() !== productId.toString()
//     );
//
//     return db.collection("users").updateOne(
//       { _id: new ObjectId(this._id) },
//       {
//         $set: { cart: { items: updatedItems } },
//       }
//     );
//   }
//
//   addOrder() {
//     const db = getDb();
//
//     return this.getCart()
//       .then((products) => {
//         const order = {
//           items: products,
//           user: {
//             _id: new ObjectId(this._id),
//             name: this.name,
//           },
//         };
//
//         return db.collection("orders").insertOne(order);
//       })
//       .then((result) => {
//         this.cart = { items: [] };
//
//         return db
//           .collection("users")
//           .updateOne(
//             { _id: new ObjectId(this._id) },
//             { $set: { cart: { items: [] } } }
//           );
//       });
//   }
//
//   getOrders() {
//     const db = getDb();
//
//     return db
//       .collection("orders")
//       .find({ "user._id": new ObjectId(this._id) })
//       .toArray();
//   }
//
//   static findById(userId) {
//     const db = getDb();
//
//     return db.collection("users").findOne({ _id: new ObjectId(userId) });
//   }
// }
//
// module.exports = User;
