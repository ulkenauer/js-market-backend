'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addIndex(
        'Baskets',
        ['userId'],
        {
          fields: 'userId',
          name: 'basket_userId',
          unique: false,
        },
        { transaction }
      );

      await queryInterface.addConstraint('Baskets', ['userId'], {
        type: 'foreign key',
        name: 'products_userId_users_id',
        references: {
          table: 'Users',
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
      await queryInterface.removeIndex('Baskets', 'basket_userId', { transaction });
      await queryInterface.removeConstraint('Baskets', 'products_userId_users_id', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
