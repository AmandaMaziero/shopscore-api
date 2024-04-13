'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('annexes', {
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
      image: {
        allowNull: false,
        type: Sequelize.STRING
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
    await queryInterface.dropTable('annexes');
  }
};