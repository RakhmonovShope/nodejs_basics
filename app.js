const path = require("path");
const express = require("express");

const bodyParser = require("body-parser");
const errorController = require("./contollers/error");
// const User = require("./models/user");
const { mongoConnect, getDb } = require("./utils/database");

const adminRoutes = require("./routes/admin");
const shopRouter = require("./routes/shop");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  // User.findByPk(1)
  //   .then((user) => {
  //     req.user = user;
  //     next();
  //   })
  //   .catch((err) => {
  //     console.log("app.js user err", err);
  //   });
  next();
});

app.use(shopRouter);
app.use("/admin", adminRoutes);

app.use(errorController.get404);

mongoConnect(() => {
  console.log("Connected!");
  app.listen(3000);
});
