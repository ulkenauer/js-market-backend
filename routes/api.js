var express = require('express');
var router = express.Router();


const { Sequelize, Model, DataTypes } = require("sequelize");
const config = require('../config/config.json');
var sequelize = new Sequelize(config[process.env.NODE_ENV]);
const User = require('../models/user')(sequelize, DataTypes);

/* GET home page. */
router.get('/register', function (req, res, next) {

    let user = User.build();
    res.send({'status': 'ok', 'message': user.register()});
});

module.exports = router;
