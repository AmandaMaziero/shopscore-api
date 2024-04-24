'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Store extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Store.hasMany(models.StoreProduct, {
        foreignKey: 'idstore'
      })
      Store.hasMany(models.Evaluation, {
        foreignKey: 'idstore'
      })
      Store.hasMany(models.Comment, {
        foreignKey: 'idstore'
      })
    }
  }
  Store.init({
    cnpj: DataTypes.STRING,
    fantasyName: DataTypes.STRING,
    corporateName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    description: DataTypes.STRING,
    telephone: DataTypes.STRING,
    cell: DataTypes.STRING,
    quality: DataTypes.FLOAT,
    numberReview: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    code: DataTypes.STRING,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Store',
    tableName: 'stores',
    freezeTableName: true,
    paranoid: true
  });
  return Store;
};