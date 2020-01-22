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

  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};