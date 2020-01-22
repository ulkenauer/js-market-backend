'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    phone: DataTypes.STRING,
    password: DataTypes.STRING
  }, {});

  User.prototype.register = function ()
  {
    return 'successfully registered';
  }

  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};