const { Sequelize, Model, DataTypes } = require('sequelize');


class Review extends Model {}

Review.init({
  author: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  note: DataTypes.TEXT,
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  message: DataTypes.TEXT
  
}, { 
    Sequelize,
    sequelize : dbConnection,
    modelName: "review"
});

module.exports = Review;
