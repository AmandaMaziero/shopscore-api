'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('stores', 'image', { type: Sequelize.STRING, allowNull: true });
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('stores', 'image');
  }
};
