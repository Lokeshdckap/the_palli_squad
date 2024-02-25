'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class unauthorized extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  unauthorized.init({
    uuid: DataTypes.UUID,
    user_uuid: DataTypes.UUID,
    device_ip: DataTypes.STRING,
    justification: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'unauthorized',
  });
  return unauthorized;
};