'use strict';
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    price: DataTypes.DOUBLE,
    measureUnits: DataTypes.INTEGER,
    measureUnitsType: DataTypes.INTEGER,
  }, {});
  Object.defineProperty(Product, 'measureUnitsTypes', {
    get: function () {
      return {
        'Kg': 0,
        'g': 1,
        'l': 2,
        'ml': 3,
        'pt': 4,
      };
    }
  });
  
  Product.associate = function(models) {
    // associations can be defined here
  };
  return Product;
};
