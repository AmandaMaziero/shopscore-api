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
      filename1: {
        allowNull: false,
        type: Sequelize.BLOB('long')
      },
      filename2: {
        type: Sequelize.BLOB('long')
      },
      filename3: {
        type: Sequelize.BLOB('long')
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