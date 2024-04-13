'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Annex extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Annex.belongsTo(models.Evaluation, {
        foreignKey: 'idevaluation',
        as: 'Evaluation'
      })
    }
  }
  Annex.init({
    idevaluation: DataTypes.INTEGER,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Annex',
    tableName: 'annexes',
    freezeTableName: true
  });
  return Annex;
};