'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pass_pharse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  pass_pharse.init({
    uuid: DataTypes.UUID,
    user_uuid: DataTypes.UUID,
    pass_pharse: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'pass_pharse',
  });
  return pass_pharse;
};