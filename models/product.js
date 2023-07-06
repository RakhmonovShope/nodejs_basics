const path = require("path");
const fs = require("fs");
const Cart = require("./cart");

const productDataDir = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "products.json"
);

const getProductsFromFile = (callback) => {
  fs.readFile(productDataDir, (err, fileContent) => {
    if (err) {
      callback([]);
    } else {
      callback(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.imageUrl = imageUrl;
    this.price = price;
  }

  save() {
    getProductsFromFile((products) => {
      if (this.id) {
        const existingProductIndex = products.findIndex(
          (product) => product.id === this.id
        );
        products[existingProductIndex] = this;
      } else {
        this.id = Math.round(Math.random() * 68000).toString();
        products.push(this);
      }
      fs.writeFile(productDataDir, JSON.stringify(products), (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
  }

  static fetchAlL(cb) {
    getProductsFromFile(cb);
  }

  static deleteById(id) {
    getProductsFromFile((products) => {
      const updatedProducts = products.filter((item) => item.id !== id);
      const product = products.find((item) => item.id === id);

      fs.writeFile(productDataDir, JSON.stringify(updatedProducts), (err) => {
        if (!err) {
          Cart.deleteProduct(id, product.price);
        }
        console.log(err);
      });
    });
  }

  static findById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((item) => item.id === id);

      cb(product);
    });
  }
};
