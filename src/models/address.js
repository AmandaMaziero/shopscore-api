'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Address.hasMany(models.StoreAddress, {
        foreignKey: 'idaddress',
        as: 'StoreAddress'
      })
    }
  }
  Address.init({
    address: DataTypes.STRING,
    number: DataTypes.INTEGER,
    district: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    city: DataTypes.STRING,
    complement: DataTypes.STRING,
    cep: DataTypes.STRING,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Address',
    tableName: 'addresses',
    freezeTableName: true
  });
  return Address;
};