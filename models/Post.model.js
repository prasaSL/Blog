const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User.model');

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
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
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
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  publishedAt: {
    type: DataTypes.DATE
  }
}, {
  timestamps: true,
  tableName: 'posts',
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

Post.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Post, { foreignKey: 'userId', onDelete: 'CASCADE' });

module.exports = Post;