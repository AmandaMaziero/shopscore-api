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
        foreignKey: 'iduser'
      })
      Evaluation.belongsTo(models.Store, {
        foreignKey: 'idstore'
      })
      Evaluation.belongsTo(models.StoreProduct, {
        foreignKey: 'idstoreproduct'
      })
      Evaluation.hasMany(models.Annex, {
        foreignKey: 'idevaluation'
      })
      Evaluation.hasMany(models.Comment, {
        foreignKey: 'idevaluation'
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