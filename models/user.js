'use strict';
const crypto = require('crypto');
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    phone: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      set(value) {
        let salt = crypto.randomBytes(64).toString('base64');
        this.setDataValue('password', salt + '.' + crypto.createHash('sha512').update(salt + value).digest('base64'));
      }
    }
  }, {});

  User.prototype.verifyPassword = function (password)
  {
    let salt = this.password.split('.')[0];
    let hash = this.password.split('.')[1];
    return hash === crypto.createHash('sha512').update(salt + password).digest('base64');
  }

  User.associate = function (models) {
    User.prototype.associations = models;
    User.hasMany(models.Basket, { foreignKey: 'userId' })
    User.hasOne(models.Basket, {
      foreignKey: 'userId', scope: {
        status: models.Basket.statuses.ACTIVE
    }, as: 'activeBasket' })
    // associations can be defined here
  };

  User.prototype.initBasket = async function ()
  {
    let basket = this.associations.Basket.build()
    if (await this.getActiveBasket() === null) {
      basket.userId = this.id
      await basket.save()
      //await this.setBasket(basket)
    }
  }

  return User;
};