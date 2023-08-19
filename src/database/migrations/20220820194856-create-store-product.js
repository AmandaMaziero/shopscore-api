'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('storeProducts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idproduct: {
        allowNull: false,
        references: { model: 'products', key: 'id' },
        foreignKey: true,
        type: Sequelize.INTEGER
      },
      idstore: {
        allowNull: false,
        references: { model: 'stores', key: 'id' },
        foreignKey: true,
        type: Sequelize.INTEGER
      },
      price: {
        allowNull: false,
        type: Sequelize.DECIMAL(20,2)
      },
      quality: {
        type: Sequelize.FLOAT
      },
      numberReview: {
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      status: {
        allowNull: false,
        comment: '0 - Inativo; 1 - Ativo;',
        defaultValue: 1,
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
    await queryInterface.dropTable('storeProducts');
  }
};