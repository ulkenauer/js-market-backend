'use strict';
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    price: DataTypes.DOUBLE,
    measureUnits: DataTypes.INTEGER,
    measureUnitsType: DataTypes.INTEGER,
    measureUnitsText: {
      type: DataTypes.VIRTUAL,
      get() {
        const typesMap = {
          1: 'кг',
          2: 'гр',
          3: 'л',
          4: 'мл',
          5: 'шт',
        }
        return typesMap[this.measureUnitsType]
      }
    },
    measureUnitsHint: {
      type: DataTypes.VIRTUAL,
      get() {
        const typesMap = {
          1: 'вес',
          2: 'вес',
          3: 'объем',
          4: 'объем',
          5: 'количество',
        }
        return typesMap[this.measureUnitsType]
      }
    }
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
