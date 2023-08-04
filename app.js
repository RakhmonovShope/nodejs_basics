const path = require("path");
const express = require("express");
const sequalize = require("./utils/database");

const bodyParser = require("body-parser");
const shopRouter = require("./routes/shop");
const errorController = require("./contollers/error");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");

const adminRoutes = require("./routes/admin");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log("app.js user err", err);
    });
});

app.use(shopRouter);
app.use("/admin", adminRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

sequalize
  // .sync({ force: true })
  .sync()
  .then(() => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (user) {
      return user;
    }

    return User.create({ name: "Max", email: "johndoe@mail.ru" });
  })
  .then((user) => {
    return user
      .getCart()
      .then((cart) => {
        if (cart) {
          return cart;
        }
        return user.createCart();
      })
      .catch((err) => console.log(err));
  })
  .then((cart) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log("Sequalize sync err", err);
  });
