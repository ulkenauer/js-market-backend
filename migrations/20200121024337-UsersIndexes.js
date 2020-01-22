'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addIndex(
        'Users',
        //'phone',
        ['phone'],//[],//null,//'',
        {
          fields: 'phone',
          name: 'user_phone',
          unique: true,
        },
        { transaction }
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      //await queryInterface.removeColumn('Person', 'petName', { transaction });
      await queryInterface.removeIndex('Users', 'user_phone', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
