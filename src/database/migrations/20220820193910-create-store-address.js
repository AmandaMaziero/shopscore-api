'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('storeAddresses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idstore: {
        allowNull: false,
        references: { model: 'stores', key: 'id' },
        foreignKey: true,
        type: Sequelize.INTEGER
      },
      idaddress: {
        allowNull: false,
        references: { model: 'addresses', key: 'id' },
        foreignKey: true,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('storeAddresses');
  }
};