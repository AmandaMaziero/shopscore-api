'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('addresses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      address: {
        allowNull: false,
        type: Sequelize.STRING(265)
      },
      number: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      district: {
        allowNull: false,
        type: Sequelize.STRING(265)
      },
      state: {
        allowNull: false,
        type: Sequelize.STRING(2)
      },
      country: {
        allowNull: false,
        type: Sequelize.STRING(265)
      },
      city: {
        allowNull: false,
        type: Sequelize.STRING(265)
      },
      complement: {
        type: Sequelize.STRING(265)
      },
      cep: {
        allowNull: false,
        type: Sequelize.STRING(10)
      },
      status: {
        allowNull: false,
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
    await queryInterface.dropTable('addresses');
  }
};