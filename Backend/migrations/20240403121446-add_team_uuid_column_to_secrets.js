"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn("secrets", "team_uuid", {
      type: Sequelize.UUID, // Replace with the actual data type
      allowNull: true, // Adjust as needed
      references: {
        model: "teams", // Replace with the actual table name
        key: "uuid", // Replace with the actual column name
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("Secrets", "team_uuid");
  },
};
