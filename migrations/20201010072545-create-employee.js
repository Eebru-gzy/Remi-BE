"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Employees", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      department: {
        type: Sequelize.STRING,
      },
      line_manager_name: {
        type: Sequelize.STRING,
      },
      line_manager_position: {
        type: Sequelize.STRING,
      },
      line_manager_phone: {
        type: Sequelize.STRING,
      },
      office_phone: {
        type: Sequelize.STRING,
      },
      phone_number: {
        type: Sequelize.STRING,
      },
      street_address: {
        type: Sequelize.STRING,
      },
      city: {
        type: Sequelize.STRING,
      },
      state: {
        type: Sequelize.STRING,
      },
      date_of_birth: {
        type: Sequelize.DATE,
      },
      nationality: {
        type: Sequelize.STRING,
      },
      gender: {
        type: Sequelize.STRING,
      },
      weight: {
        type: Sequelize.DECIMAL,
      },
      height: {
        type: Sequelize.DECIMAL,
      },
      genotype: {
        type: Sequelize.STRING,
      },
      blood_group: {
        type: Sequelize.STRING,
      },
      bank_name: {
        type: Sequelize.STRING,
      },
      account_number: {
        type: Sequelize.STRING,
      },
      tax_id: {
        type: Sequelize.STRING,
      },
      pension_id: {
        type: Sequelize.STRING,
      },
      insurance_number: {
        type: Sequelize.STRING,
      },
      nok_name: {
        type: Sequelize.STRING,
      },
      nok_phone: {
        type: Sequelize.STRING,
      },
      nok_street: {
        type: Sequelize.STRING,
      },
      nok_address: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Employees");
  },
};
