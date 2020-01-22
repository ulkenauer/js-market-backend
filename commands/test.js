module.exports = async (commandArgs) => {
    const { Sequelize, Model, DataTypes } = require("sequelize");
    const config = require('../config/config.json');
    var sequelize = new Sequelize(config[process.env.NODE_ENV]);
    const Basket = require('../models/basket')(sequelize, DataTypes);

    let basket = Basket.build();
    basket.userId = 2;
    basket.status = Basket.statuses.FROZEN;
    await basket.save();
}