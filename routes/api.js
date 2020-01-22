var express = require('express');
var router = express.Router();

const AsyncHandler = require('./AsyncHandler')
const UserService = require('../services/UserService');
const { Sequelize, Model, DataTypes } = require("sequelize");
const config = require('../config/config.json');
var sequelize = new Sequelize(config[process.env.NODE_ENV]);
const User = require('../models/user')(sequelize, DataTypes);

let user = null;
let UserMiddleware = AsyncHandler( async (req, res, next)  => {
    
    if (!req.headers['x-auth']) {
        throw {status: 401, message: 'no JWT token found'};
    }

    let token = UserService.verifyToken(req.headers['x-auth'])

    if (token === false) {
        throw {status: 401, message: 'invalid JWT token'};
    }

    try {
        user = await User.findOne({ where: { phone: token.phone } });
    } catch (err) {
        throw {status: 401, message: err};
    }

    if (user === null) {
        throw {status: 401, message: 'user is not found'};
    }

    next()
})

router.use(UserMiddleware)

router.get('/hello', function (req, res, next) {
    res.send(`Ваш номер ${user.phone}`)
});


module.exports = router;
