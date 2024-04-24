'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Comment.belongsTo(models.Evaluation, {
        foreignKey: 'idevaluation'
      })
      Comment.belongsTo(models.User, {
        foreignKey: 'iduser'
      })
      Comment.belongsTo(models.Store, {
        foreignKey: 'idstore'
      })
    }
  }
  Comment.init({
    idevaluation: DataTypes.INTEGER,
    iduser: DataTypes.INTEGER,
    idstore: DataTypes.INTEGER,
    comment: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Comment',
    tableName: 'comments',
    freezeTableName: true
  });
  return Comment;
};