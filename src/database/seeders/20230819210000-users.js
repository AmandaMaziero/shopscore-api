'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [{
      name: "Admin",
      email: "admin@admin.com",
      password: "$2b$12$NHF/GzUY9nRZskJp.6ge7eONrCZ3oKpfIqxVO0usG6ZTMQ2cMe67u",
      cpf: "44577006812",
      birthDate: "2002-06-10",
      telephone: "15997933265",
      gender: 1,
      type: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: "Cliente",
      email: "cliente@cliente.com",
      password: "$2b$12$NHF/GzUY9nRZskJp.6ge7eONrCZ3oKpfIqxVO0usG6ZTMQ2cMe67u",
      birthDate: "2002-10-14",
      cpf: "44444444444",
      telephone: "15999999999",
      gender: 1,
      type: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {})
  }
};
