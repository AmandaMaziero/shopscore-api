'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('evaluations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      iduser: {
        allowNull: false,
        references: { model: 'users', key: 'id' },
        foreignKey: true,
        type: Sequelize.INTEGER
      },
      idstore: {
        references: { model: 'stores', key: 'id' },
        foreignKey: true,
        type: Sequelize.INTEGER
      },
      idstoreproduct: {
        references: { model: 'storeProducts', key: 'id' },
        foreignKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING(265)
      },
      description: {
        allowNull: false,
        type: Sequelize.STRING(500)
      },
      answer: {
        type: Sequelize.STRING(500)
      },
      status: {
        allowNull: false,
        comment: '0 - Resposta Pendente; 1 - Respondido;',
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
    await queryInterface.dropTable('evaluations');
  }
};