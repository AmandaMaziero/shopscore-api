'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.changeColumn('stores', 'password', { type: Sequelize.STRING(100), allowNull: true });
    queryInterface.changeColumn('stores', 'description', { type: Sequelize.STRING(255), allowNull: true });
  },

  async down(queryInterface, Sequelize) {
    queryInterface.changeColumn('stores', 'password', { type: Sequelize.STRING(100), allowNull: false });
    queryInterface.changeColumn('stores', 'description', { type: Sequelize.STRING(100), allowNull: false });
  }
};