'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addIndex(
        'BasketItems',
        ['basketId'],
        {
          fields: 'basketId',
          name: 'basketItem_basketId',
          unique: false,
        },
        { transaction }
      );

      await queryInterface.addConstraint('BasketItems', ['basketId'], {
        type: 'foreign key',
        name: 'basketItems_basketId_baskets_id',
        references: {
          table: 'Baskets',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      });

      await queryInterface.addIndex(
        'BasketItems',
        ['productId'],
        {
          fields: 'productId',
          name: 'basketItem_productId',
          unique: false,
        },
        { transaction }
      );

      await queryInterface.addConstraint('BasketItems', ['productId'], {
        type: 'foreign key',
        name: 'basketItems_productId_products_id',
        references: {
          table: 'Products',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeIndex('BasketItems', 'basketItem_basketId', { transaction });
      await queryInterface.removeConstraint('BasketItems', 'basketItems_basketId_baskets_id', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
