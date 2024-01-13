'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Evaluation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Evaluation.belongsTo(models.User, {
        foreignKey: 'iduser',
        as: 'User'
      })
      Evaluation.belongsTo(models.Store, {
        foreignKey: 'idstore',
        as: 'Store'
      })
      Evaluation.belongsTo(models.StoreProduct, {
        foreignKey: 'idstoreproduct',
        as: 'StoreProduct'
      })
      Evaluation.hasMany(models.Annex, {
        foreignKey: 'idevaluation',
        as: 'Annex'
      })
      Evaluation.hasMany(models.Comment, {
        foreignKey: 'idevaluation',
        as: 'Comment'
      })
    }
  }
  Evaluation.init({
    iduser: DataTypes.INTEGER,
    idstore: DataTypes.INTEGER,
    idstoreproduct: DataTypes.INTEGER,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    rating: DataTypes.INTEGER,
    answer: DataTypes.STRING,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Evaluation',
    tableName: 'evaluations',
    freezeTableName: true
  });
  return Evaluation;
};