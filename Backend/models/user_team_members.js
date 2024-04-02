'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_team_members extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user_team_members.init({
    uuid: DataTypes.UUID,
    user_uuid: DataTypes.UUID,
    team_uuid: DataTypes.UUID,
    role_type: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'user_team_members',
  });
  return user_team_members;
};