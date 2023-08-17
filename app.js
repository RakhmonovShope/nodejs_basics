const path = require("path");
const express = require("express");

const bodyParser = require("body-parser");
const errorController = require("./contollers/error");
const User = require("./models/user");
const mongoose = require("mongoose");

const adminRoutes = require("./routes/admin");
const shopRouter = require("./routes/shop");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("64de6f6a4433bc81b1e469ae")
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

mongoose
  .connect(
    "mongodb+srv://rakhmonovshope:J3kyf9C3FH*GwTQ@nodejs.movqxia.mongodb.net/shop"
  )
  .then(() => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "ShoPe",
          email: "rakhmonovshope0110@mail.ru",
          cart: {
            items: [],
          },
        });

        user.save();
      }
    });

    console.log("Connected!");
    app.listen(3000);
  })
  .catch((err) => {
    console.log("Connection error");
  });
