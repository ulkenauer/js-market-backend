'use strict';
module.exports = (sequelize, DataTypes) => {
  const BasketItem = sequelize.define('BasketItem', {
    basketId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    fixedTotal: DataTypes.DOUBLE
  }, {});
  BasketItem.associate = function(models) {
    // associations can be defined here
  };
  return BasketItem;
};