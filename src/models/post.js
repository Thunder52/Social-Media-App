'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Post.belongsTo(models.User, {
        foreignKey: 'userId',
        sourceKey: 'id'
      });
      Post.hasMany(models.Comment,{
        foreignKey:'postId'
      });
    }
  }
  Post.init({
    image: DataTypes.STRING,
    description:DataTypes.STRING,
    isPrivate:DataTypes.BOOLEAN,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};