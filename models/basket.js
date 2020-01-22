'use strict';
module.exports = (sequelize, DataTypes) => {
  const Basket = sequelize.define('Basket', {
    userId: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
/*     statuses: {
      get() {
        return {
          'FROZEN': 0,
          'ACTIVE': 1
        };
      }
    } */
  }, {});
  Object.defineProperty(Basket, 'statuses', {
    get: function () {
      return {
        'FROZEN': 0,
        'ACTIVE': 1
      };
    }
  });

  Basket.associate = function(models) {
    // associations can be defined here
  };
  return Basket;
};