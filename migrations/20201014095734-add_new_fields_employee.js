"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn("Employees", "job_title", {
      type: Sequelize.STRING,
      before: "department",
    });

    await queryInterface.addColumn("Employees", "branch", {
      type: Sequelize.STRING,
      after: "department",
    });

    return;
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
