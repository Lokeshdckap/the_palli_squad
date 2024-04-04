"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("shares", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      uuid: {
        type: Sequelize.UUID,
        unique: true,
        allowNull: false,
      },
      secret_uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "secrets",
          key: "uuid",
        },
      },
      user_uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "uuid",
        },
      },
      team_uuid: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "teams",
          key: "uuid",
        },
      },
      access_type: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      expiration_date: {
        type: Sequelize.DATE,
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("shares");
  },
};
