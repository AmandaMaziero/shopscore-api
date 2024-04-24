'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StoreProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      StoreProduct.belongsTo(models.Product, {
        foreignKey: 'idproduct'
      })
      StoreProduct.belongsTo(models.Store, {
        foreignKey: 'idstore'
      })
      StoreProduct.hasMany(models.Evaluation, {
        foreignKey: 'idstoreproduct'
      })
    }
  }
  StoreProduct.init({
    idproduct: DataTypes.INTEGER,
    idstore: DataTypes.INTEGER,
    price: DataTypes.DECIMAL,
    quality: DataTypes.FLOAT,
    numberReview: DataTypes.INTEGER,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'StoreProduct',
    tableName: 'storeProducts',
    freezeTableName: true
  });
  return StoreProduct;
};