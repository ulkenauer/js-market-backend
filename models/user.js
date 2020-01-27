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
        frozenAt: null
    }, as: 'activeBasket' })
    // associations can be defined here
  };

  User.prototype.getCurrentBasket = async function ()
  {
    let currentBasket = this.associations.Basket.findOne({
      where: {userId: this.id},
      order: [
      ['id', 'DESC']
      ]
    })
    
    return currentBasket
  }

  User.prototype.initBasket = async function ()
  {
    let currentBasket = await this.getCurrentBasket()
    let self = this

    let initialize = async function () {
      let basket = self.associations.Basket.build()
      basket.userId = self.id
      await basket.save()
    }

    if (currentBasket === null) {
      await initialize()
    } else if(currentBasket.frozen) {
      let now = new Date
      let frozenDate = new Date(currentBasket.frozenAt)
      frozenDate.setHours(0, 0, 0)
      frozenDate.setDate(frozenDate.getDate() + 1)

      if (now > frozenDate) {
        await initialize()
      }
    }
  }

  return User;
};