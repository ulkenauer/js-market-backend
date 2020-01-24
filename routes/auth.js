var express = require('express');
var router = express.Router();

const AsyncHandler = require('./AsyncHandler')
const UserService = require('../services/UserService');
const { Sequelize, Model, DataTypes } = require("sequelize");
const config = require('../config/config.json');
var sequelize = new Sequelize(config[process.env.NODE_ENV]);
const User = require('../models/user')(sequelize, DataTypes);
const Basket = require('../models/basket')(sequelize, DataTypes);

User.associate({Basket})

/* GET home page. */
router.get('/register', AsyncHandler(async function (req, res, next) {

    let query = req.query;

    if (!('phone' in query) || !('password' in query)) {
        res.send({'status': 'error', 'message': 'phone or password not provided'});
        return;
    }

    if (query.password.length < 5) {
        res.send({'status': 'error', 'message': 'password should be at least 5 characters long'});
        return;
    }

    let user = User.build();

    user.password = req.query.password;
    user.phone = req.query.phone;

    await user.save()
    await user.initBasket()
    await user.save()

    let token = UserService.generateToken(user);

    res.send({'status': 'ok', 'token': token});
}));

router.get('/login', async function (req, res, next) {

    let query = req.query;

    if (!('phone' in query) || !('password' in query)) {
        res.send({ 'status': 'error', 'message': 'phone or password not provided' });
        return;
    }
    
    let user = null;
    try {
        user = await User.findOne({ where: { phone: query.phone } });
    } catch (err) {
        res.send({'status': 'error', 'message': err});
        return;
    }

    if (user === null) {
        res.send({'status': 'error', 'message': 'user is not found'});
        return;
    }

    if (user.verifyPassword(query.password) === false) {
        res.send({'status': 'error', 'message': 'passwords do not match'});
        return;
    }

    let token = UserService.generateToken(user);

    res.send({'status': 'ok', 'token': token});
});

module.exports = router;
