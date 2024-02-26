"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  users.init(
    {
      uuid: DataTypes.UUID,
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      mobile_no: DataTypes.STRING,
      avatar: DataTypes.STRING,
      isVerified: DataTypes.BOOLEAN,
      isApproved: DataTypes.INTEGER,
      device_ip: DataTypes.STRING,
      role_type: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "users",
    }
  );
  return users;
};
