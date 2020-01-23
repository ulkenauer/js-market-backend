var express = require('express');
var router = express.Router();

const AsyncHandler = require('./AsyncHandler')
const UserService = require('../services/UserService');
const { Sequelize, Model, DataTypes } = require("sequelize");
const config = require('../config/config.json');
var sequelize = new Sequelize(config[process.env.NODE_ENV]);
const User = require('../models/user')(sequelize, DataTypes);
const Product = require('../models/product')(sequelize, DataTypes);

const Basket = require('../models/basket')(sequelize, DataTypes);
const BasketItem = require('../models/basketitem')(sequelize, DataTypes);
User.associate({ Basket })
Basket.associate({ User, BasketItem })
BasketItem.associate({ Basket, Product })
/* 

Basket.associate({ User, BasketItem })

User.associate({ Basket }) */

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

// public api methods
router.get('/products/list', AsyncHandler(async function (req, res, next) {
    let query = req.query;
    let page = 1;
    if ('p' in query) {
        if (query.p > 0 && Number.isInteger(Number(query.p))) {
            page = query.p;
        }
    }

    let pageSize = 20;
    let products = await Product.findAll({ offset: (page-1) * pageSize, limit: pageSize });
    
    res.send(products);
}));

router.get('/products/detail', AsyncHandler(async function (req, res, next) {
    let query = req.query;

    if ('id' in query === false) {
        throw {status:400, message: `id is required`}
    }

    let id = query.id;

    let product = await Product.findByPk(id);
    
    if (product === null) {
        throw {status:404, message: `product with id ${id} is not found`}
    }

    res.send(product);
}));

router.use(UserMiddleware)


//private api methods

router.get('/basket', AsyncHandler(async function (req, res, next) {
    let basket = await user.getActiveBasket()
    let details = await basket.getDetailed()
    res.send(details)
}));

router.post('/basket/set-good', AsyncHandler(async function (req, res, next) {
    let query = req.body
    const requiredProps = ['product_id', 'amount']

    let missingProps = []

    requiredProps.forEach(requiredProp => {
        if (requiredProp in query === false) {
            missingProps.push(requiredProp)
        }
    })

    if (missingProps.length > 0) {
        throw {status: 400, message: `Missing required props: ${missingProps.join(', ')}`}
    }

    await user.initBasket()
    let basket = await user.getActiveBasket()
    await basket.setGood({productId: query.product_id, amount: query.amount})
    res.send({status: 'ok'})
}));

router.post('/basket/clear', AsyncHandler(async function (req, res, next) {
    let basket = await user.getActiveBasket()
    await basket.clear()
    res.send({status: 'ok'})
}));

router.post('/basket/freeze', AsyncHandler(async function (req, res, next) {
    let basket = await user.getActiveBasket()
    await basket.freeze()
    res.send({status: 'ok'})
}));


module.exports = router;
