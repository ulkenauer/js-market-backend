'use strict';
const { Sequelize, Model, DataTypes } = require("sequelize");
const config = require('../config/db.json');
var sequelize = new Sequelize(config["development"]);
const Product = require('../models/product')(sequelize, DataTypes);

module.exports = {
  up: (queryInterface, Sequelize) => {
    let demoProducts = [{
      name: 'Вода питьевая',
      measureUnitsType: Product.measureUnitsTypes['l'],
      measureUnits: 2,
      price: 100,
      imageUrl: 'https://i.imgur.com/9pv8jdU.jpg'
    },
    {
      name: 'Вода не питьевая',
      measureUnitsType: Product.measureUnitsTypes['l'],
      measureUnits: 2,
      price: 200,
      imageUrl: 'https://i.imgur.com/9pv8jdU.jpg'
    },
    {
      name: 'Вода питьевая',
      measureUnitsType: Product.measureUnitsTypes['ml'],
      measureUnits: 1,
      price: 400,
      imageUrl: 'https://i.imgur.com/9pv8jdU.jpg'
    },
    {
      name: 'Автошина',
      measureUnitsType: Product.measureUnitsTypes['pt'],
      measureUnits: 1,
      price: 375.8,
      imageUrl: 'https://i.imgur.com/ZPGCxr9.png'
    },
    {
      name: 'Автошина, но две',
      measureUnitsType: Product.measureUnitsTypes['pt'],
      measureUnits: 3,
      price: 675.28,
      imageUrl: 'https://i.imgur.com/ZPGCxr9.png'
    }
    ];
    
    let autoProducts = [];

    for (let i = 0; i < 1000; i++) {
      let measureUnitsType = 1;
      let measureUnits = 2 + Math.ceil(Math.random() * 1000);

      autoProducts.push({
        name: `Продукт #${i}`,
        price: Math.random() * 1000,
        measureUnits,
        measureUnitsType
      })
    }

    demoProducts = demoProducts.concat(autoProducts);

    demoProducts = demoProducts.map(product => {
      product.createdAt = (new Date).toISOString()
      product.updatedAt = (new Date).toISOString()
      return product
    })

    return queryInterface.bulkInsert('Products', demoProducts, {});
},

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
