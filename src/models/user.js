'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Evaluation, {
        foreignKey: 'iduser',
        as: 'Evaluation'
      })
      User.hasMany(models.Comment, {
        foreignKey: 'iduser',
        as: 'Comment'
      })
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    birthDate: DataTypes.DATE,
    cpf: DataTypes.STRING,
    telephone: DataTypes.STRING,
    gender: DataTypes.INTEGER,
    image: DataTypes.BLOB('long'),
    type: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    code: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    freezeTableName: true,
    paranoid: true
  });
  return User;
};