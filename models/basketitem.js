'use strict';
module.exports = (sequelize, DataTypes) => {
  const BasketItem = sequelize.define('BasketItem', {
    basketId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    fixedTotal: DataTypes.DOUBLE
  }, {});

  BasketItem.associate = function(models) {
    BasketItem.belongsTo(models.Basket, { foreignKey: 'basketId' })
    BasketItem.belongsTo(models.Product, { foreignKey: 'productId' })
  };
  return BasketItem;
};