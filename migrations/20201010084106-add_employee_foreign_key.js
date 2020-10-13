"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * 
     * ," EmployeeDocuments", "EmployeeId", {
      type: Sequelize.INTEGER,
      references: {
        model: "Employees",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    }
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     * 
     * "ALTER TABLE user
  ADD CONSTRAINT user_group_id_fkey FOREIGN KEY (group_id)
  REFERENCES group (id) MATCH SIMPLE
  ON UPDATE CASCADE ON DELETE CASCADE;"
     */
    return queryInterface.sequelize.query("ALTER TABLE EmployeeDocuments ADD CONSTRAINT EmployeeID FOREIGN KEY (EmployeeID) REFERENCES Employees (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE SET NULL");
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.removeColumn("EmployeeDocuments", "EmployeeId");
  },
};
