'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('stores', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cnpj: {
        allowNull: false,
        type: Sequelize.STRING(14)
      },
      fantasyName: {
        allowNull: false,
        type: Sequelize.STRING(265)
      },
      corporateName: {
        allowNull: false,
        type: Sequelize.STRING(265)
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING(265)
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING(100)
      },
      description: {
        allowNull: false,
        type: Sequelize.STRING(100)
      },
      telephone: {
        allowNull: true,
        type: Sequelize.STRING(11)
      },
      cell: {
        allowNull: true,
        type: Sequelize.STRING(11)
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
        defaultValue: 1,
        comment: '-1 - Excluído; 0 - Inativo; 1 - Ativo;',
        type: Sequelize.INTEGER
      },
      code: {
        allowNull: true,
        type: Sequelize.STRING(6)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('stores');
  }
};