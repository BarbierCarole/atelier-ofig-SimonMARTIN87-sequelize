const { Sequelize, Model, DataTypes } = require('sequelize');


class Figurine extends Model {}

Figurine.init({
  name: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  size: DataTypes.REAL,
  price: {
    type: DataTypes.REAL,
    allowNull: false
  },
  category: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, { 
    Sequelize,
    sequelize : dbConnection,
    modelName: "figurine"
});

module.exports = Figurine;
