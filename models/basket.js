'use strict';
module.exports = (sequelize, DataTypes) => {
  const Basket = sequelize.define('Basket', {
    userId: DataTypes.INTEGER,
    frozenAt: DataTypes.DATE,
    frozen: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.frozenAt !== null
      }
    }
  }, {});

  Basket.prototype.removeGood = async function (productId) {
    await this.associations.BasketItem.destroy({
      where: {
        basketId: this.id,
        productId: productId
      }
    })
  }

  Basket.prototype.setGood = async function (data) {
    let basketItem = await this.associations.BasketItem.findOne({
      where: {
        basketId: this.id,
        productId: data.productId
      }
    })
    
    if (basketItem === null) {
      basketItem = this.associations.BasketItem.build()
      if (data.amount <= 0) {
        return
      }
    } else {
      if (data.amount <= 0) {
        await basketItem.destroy()
        return
      }
    }

    basketItem.productId = data.productId
    basketItem.amount = data.amount
    basketItem.basketId = this.id
    await basketItem.save()
  }

  Basket.prototype.freeze = async function () {
    this.frozenAt = new Date
    let basketItems = await this.getBasketItems()
    let promises = basketItems.map(basketItem => {
      return async function () {
        let product = await basketItem.getProduct()
        let total = product.price * basketItem.amount
        basketItem.fixedTotal = total
        await basketItem.save()
      }()
    })

    await Promise.all(promises)
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
    let self = this
    let basketItems = await this.getBasketItems()
    let total = await this.getTotal()
    let products = []
    
    let promises = basketItems.map(basketItem => {
      return async function() {
        let product = await basketItem.getProduct()

        let price = product.price
        if (self.frozen) {
          price = basketItem.fixedTotal / basketItem.amount
        }

        products.push({
          id: product.id,
          price: price,
          imageUrl: product.imageUrl,
          name: product.name,
          amount: basketItem.amount
        }) 
      }()
    })

    await Promise.all(promises)    

    return { total, products, frozen: this.frozen }
  }

  Basket.prototype.getTotal = async function () {
    let basketItems = await this.getBasketItems()
    let total = 0
    if (this.frozen) {
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