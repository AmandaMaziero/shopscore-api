'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StoreAddress extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      StoreAddress.belongsTo(models.Store, {
        foreignKey: 'idstore',
        as: 'Store'
      })
      StoreAddress.belongsTo(models.Address, {
        foreignKey: 'idaddress',
        as: 'Address'
      })
    }
  }
  StoreAddress.init({
    idstore: DataTypes.INTEGER,
    idaddress: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'StoreAddress',
    freezeTableName: true
  });
  return StoreAddress;
};