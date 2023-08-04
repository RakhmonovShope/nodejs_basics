const Sequalize = require("sequelize");

const sequalize = require("../utils/database");

const User = sequalize.define("user", {
  id: {
    type: Sequalize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: Sequalize.STRING,
  email: Sequalize.STRING,
});

module.exports = User;
