const { DataTypes } = require('sequelize');
const slugify = require('slugify');

module.exports = (sequelize) => {
  const Post = sequelize.define('Post', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Title is required' },
        len: { args: [3, 200], msg: 'Title must be between 3 and 200 characters' }
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Content is required' }
      }
    },
    featuredImage: {
      type: DataTypes.STRING,
      defaultValue: 'default-post.jpg'
    },
    status: {
      type: DataTypes.ENUM('draft', 'published'),
      defaultValue: 'draft'
    },
    publishedAt: {
      type: DataTypes.DATE
    }
  }, {
    timestamps: true,
    hooks: {
      beforeCreate: (post) => {
        
        if (post.status === 'published' && !post.publishedAt) {
          post.publishedAt = new Date();
        }
      },
      beforeUpdate: (post) => {
        if (post.changed('status') && post.status === 'published' && !post.publishedAt) {
          post.publishedAt = new Date();
        }
      }
    }
  });

  return Post;
};