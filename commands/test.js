module.exports = async (commandArgs) => {    


   const { Sequelize, Model, DataTypes } = require("sequelize");
    const config = require('../config/config.json');
    var sequelize = new Sequelize(config[process.env.NODE_ENV]);
    const Product = require('../models/product')(sequelize, DataTypes);
    const User = require('../models/user')(sequelize, DataTypes);
    const Basket = require('../models/basket')(sequelize, DataTypes);
    const BasketItem = require('../models/basketitem')(sequelize, DataTypes);

    User.associate({ Basket })
    Basket.associate({ User, BasketItem })
    BasketItem.associate({Basket, Product})
    //let product = Product.build()
    //console.log(Product.measureUnitsTypes)
    //console.log(product.measureUnitsTypes)
    //console.log(Product.bruh())
    //console.log(product.bruh())


    let user = await User.findOne({ where: { phone: "89131719402" } });
    //await user.setBasket(Basket.build())
    await user.initBasket()
    //await user.save()

    //basketItem.productId = 2
    //basketItem.amount = 2
    
    //let baskets = await user.getBaskets()
    let basket = await user.getActiveBasket()
    await basket.setGood({ productId: 5, amount: 18 })
    await basket.setGood({productId: 15, amount: 8})
    await basket.removeGood(15)

    console.log(await basket.getTotal())

    //basketItem.basketId = basket.id
    //await basketItem.save()
    //await basket.setGood({productId: 5, amount: 88})
    //await basket.clear()

    /* console.log(basket)
    basket.addBasketItems([basketItem])
    basketItem.basket = basket
//    console.log(basketItem.basket)
    await basketItem.save()
    await basket.save() */
    //console.log(await basket.getBasketItems())

    //await basket.save()
    //console.log(basketItem)
    //user.getBasket().addProduct()

    // console.log(user.password)
    // user.password = 'bruh'
    // console.log(user.password)

    // console.log(user.verifyPassword('bruh'))
    // console.log(user.verifyPassword('aqwefqf'))





/* 
    const JWTService = require('../services/JWTService')

    var payload = {
        data1: "Data 1",
        data2: "Data 2",
        data3: "Data 3",
        data4: "Data 4",
    };
    
       var options = {
        issuer: "Authorizaxtion/Resource/This server",
        subject: "iam@user.me", 
        audience: "Client_Identity" // this should be provided by client
       }

    let signed = JWTService.sign(payload, options);

    let text = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhMSI6IkRhdGEgMSIsImRhdGEyIjoiRGF0YSAyIiwiZGF0YTMiOiJEYXRhIDMiLCJkYXRhNCI6IkRhdGEgNCIsImlhdCI6MTU3OTY2NTEwMCwiZXhwIjoxNTgyMjU3MTAwLCJhdWQiOiJDbGllbnRfSWRlbnRpdHkiLCJpc3MiOiJBdXRob3JpemF4dGlvbi9SZXNvdXJjZS9UaGlzIHNlcnZlciIsInN1YiI6ImlhbUB1c2VyLm1lIn0.D7HqQ78cScKjihbihER4Y030fKW_D1WaxeQK4Ris4sSgOU5zFIUx7Jgnp9Hsda3li5lTHw_PvRBUk_K6WZs5ww';
    //   console.log(signed)
    //console.log(JWTService.decode(text))

    var v_options = {
        issuer: "Authorizaxtion/Resource/This server",
        subject: "iam@user.me", 
        audience: "Client_Identity" // this should be provided by client
    }
    
    //console.log(JWTService.decode(text))
    console.log(JWTService.verify(text, v_options))
    
    //crypto.createHash('sha512').update('The quick brown fox jumps over the lazy dog.').digest('base64');


 */






























/*     const { Sequelize, Model, DataTypes } = require("sequelize");
    const config = require('../config/config.json');
    var sequelize = new Sequelize(config[process.env.NODE_ENV]);
    const Basket = require('../models/basket')(sequelize, DataTypes);

    let basket = Basket.build();
    basket.userId = 2;
    basket.status = Basket.statuses.FROZEN;
    await basket.save(); */
}