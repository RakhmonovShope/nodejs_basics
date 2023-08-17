const { Schema, model } = require("mongoose");

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = model("Product", productSchema);

// const { ObjectId } = require("mongodb");
// const { getDb } = require("../utils/database");
//
// class Product {
//   constructor(title, imageUrl, price, description, id, userId, cart) {
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.price = price;
//     this._id = id ? new ObjectId(id) : null;
//     this.userId = userId;
//     this.cart = cart;
//   }
//
//   save() {
//     const db = getDb();
//
//     let dbOp;
//
//     if (this._id) {
//       dbOp = db
//         .collection("products")
//         .updateOne({ _id: this._id }, { $set: this });
//     } else {
//       dbOp = db.collection("products").insertOne(this);
//     }
//
//     return dbOp
//       .then((result) => {
//         console.log(result);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
//
//   addToCart(product) {
//     const updatedCart = { items: [{ ...product, quantity: 1 }] };
//     const db = getDb();
//
//     return db.collection("users").updateOne(
//       { _id: new ObjectId(this._id) },
//       {
//         $set: { cart: updatedCart },
//       }
//     );
//   }
//
//   static fetchAll() {
//     const db = getDb();
//
//     return db
//       .collection("products")
//       .find()
//       .toArray()
//       .then((products) => {
//         return products;
//       })
//       .catch((err) => console.log(err));
//   }
//
//   static findById(prodId) {
//     const db = getDb();
//
//     return db
//       .collection("products")
//       .find({ _id: new ObjectId(prodId) })
//       .next()
//       .then((product) => {
//         return product;
//       })
//       .catch((err) => console.log(err));
//   }
//
//   static deleteById(prodId) {
//     const db = getDb();
//
//     return db
//       .collection("products")
//       .deleteOne({ _id: new ObjectId(prodId) })
//       .then((result) => {
//         console.log("Deleted!");
//       })
//       .catch((err) => console.log(err));
//   }
// }
//
// module.exports = Product;
