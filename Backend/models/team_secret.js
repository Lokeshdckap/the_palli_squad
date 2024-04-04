'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class team_secret extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  team_secret.init({
    uuid: DataTypes.UUID,
    team_uuid: DataTypes.UUID,
    secret_uuid: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'team_secret',
  });
  return team_secret;
};