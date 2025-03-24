const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('_helpers/db'); // assuming db.js is where your sequelize instance is set up

const Shift = sequelize.define('Shift', {
  timeIn: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timeOut: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Shift;
