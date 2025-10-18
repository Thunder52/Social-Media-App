'use strict';
const {
  Model
} = require('sequelize');
const bcrypt=require('bcrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Post, {
        foreignKey: 'userId',
        sourceKey: 'id'
      });
      User.hasMany(models.Comment,{
        foreignKey:'userId'
      })
    }
  }
  User.init({
    fullName: {type:DataTypes.STRING,allowNull:false},
    email: {type: DataTypes.STRING,unique:true},
    password: {type: DataTypes.STRING,allowNull:false}
  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeCreate(async(User)=>{
    const hashPassword=await bcrypt.hash(User.password,10);
    User.password=hashPassword;
  })
  return User;
};