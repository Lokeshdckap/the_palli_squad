'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class shares extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  shares.init({
    uuid: DataTypes.UUID,
    secret_uuid: DataTypes.UUID,
    user_uuid: DataTypes.UUID,
    team_uuid: DataTypes.UUID,
    access_type: DataTypes.INTEGER,
    expiration_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'shares',
  });
  return shares;
};