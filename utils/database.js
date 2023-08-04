const Sequalize = require("sequelize");

const sequalize = new Sequalize("node-complete", "root", "$hoPe7444", {
  dialect: "mysql",
  root: "localhost",
});

module.exports = sequalize;
