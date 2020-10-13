"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn("Companies", "confirm_token", {
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn("Companies", "email_verified", {
      type: Sequelize.BOOLEAN,
      default: false,
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
