"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class secrets extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  secrets.init(
    {
      uuid: DataTypes.UUID,
      title: DataTypes.STRING,
      username: DataTypes.STRING,
      user_uuid: DataTypes.UUID,
      encrypted_password: DataTypes.TEXT,
      description: DataTypes.TEXT,
      encrypted_attachment: DataTypes.BLOB,
      encrypted_file_type: DataTypes.STRING,
      encrypted_fileName: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "secrets",
    }
  );
  return secrets;
};
