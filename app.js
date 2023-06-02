const path = require("path");
const express = require("express");

const bodyParser = require("body-parser");
const shopRouter = require("./routes/shop");
const errorController = require("./contollers/error");

const adminRoutes = require("./routes/admin");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(shopRouter);
app.use("/admin", adminRoutes);

app.use(errorController.get404);

app.listen(3000);
