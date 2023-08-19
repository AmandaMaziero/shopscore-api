'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Comments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idevaluation: {
        allowNull: false,
        references: { model: 'evaluations', key: 'id' },
        foreignKey: true,
        type: Sequelize.INTEGER
      },
      iduser: {
        references: { model: 'users', key: 'id' },
        foreignKey: true,
        type: Sequelize.INTEGER
      },
      idstore: {
        references: { model: 'stores', key: 'id' },
        foreignKey: true,
        type: Sequelize.INTEGER
      },
      comment: {
        allowNull: false,
        type: Sequelize.STRING(500)
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
    await queryInterface.dropTable('Comments');
  }
};