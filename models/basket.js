'use strict';
module.exports = (sequelize, DataTypes) => {
  const Basket = sequelize.define('Basket', {
    userId: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
/*     statuses: {
      get() {
        return {
          'FROZEN': 0,
          'ACTIVE': 1
        };
      }
    } */
  }, {});
  Object.defineProperty(Basket, 'statuses', {
    get: function () {
      return {
        'FROZEN': 0,
        'ACTIVE': 1
      };
    }
  });

  Basket.prototype.removeGood = async function (productId) {
    await this.associations.BasketItem.destroy({
      where: {
        basketId: this.id,
        productId: productId
      }
    })

    //also works
    /* let basketItem = await this.associations.BasketItem.findOne({
      where: {
        basketId: this.id,
        productId: productId
      }
    })

    await basketItem.destroy() */
  }

  Basket.prototype.setGood = async function (data) {
    //basket.addBasketItems([basketItem])
    let basketItem = await this.associations.BasketItem.findOne({
      where: {
        basketId: this.id,
        productId: data.productId
      }
    })
    
    if (basketItem === null) {
      basketItem = this.associations.BasketItem.build()
    }

    basketItem.productId = data.productId
    basketItem.amount = data.amount
    basketItem.basketId = this.id
    await basketItem.save()
  }

  Basket.prototype.freeze = async function () {

  }

  Basket.prototype.clear = async function () {
    await this.associations.BasketItem.destroy({
      where: {
        basketId: this.id,
        fixedTotal: null
      }
    })
  }

  Basket.prototype.getDetailed = async function () {
    let basketItems = await this.getBasketItems()
    let total = await this.getTotal()
    let products = []
    
    let promises = basketItems.map(basketItem => {
      return async function() {
        let product = await basketItem.getProduct()
        products.push({
          price: product.price,
          name: product.name,
          amount: basketItem.amount
        }) 
      }()
    })

    await Promise.all(promises)    

    return { total, products }
  }

  Basket.prototype.getTotal = async function () {
    let basketItems = await this.getBasketItems()
    let total = 0
    if (this.status === Basket.statuses.FROZEN) {
      basketItems.forEach(basketItem => {
        total += basketItem.fixedTotal
      })
    } else {
      let promises = basketItems.map(basketItem => {
        return async function() {
          let product = await basketItem.getProduct()
          total += product.price * basketItem.amount
        }()
      })

      await Promise.all(promises)
    }

    return total
  }

  Basket.associate = function (models) {
    Basket.prototype.associations = models;
    Basket.belongsTo(models.User, { foreignKey: 'userId' })
    Basket.hasMany(models.BasketItem, {
      foreignKey: {
        name: 'basketId',
        allowNull: false
      }
    })
    // associations can be defined here
  };
  return Basket;
};