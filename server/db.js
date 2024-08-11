const { Sequelize, DataTypes } = require('sequelize');

// 创建数据库连接实例
// 修改成自己的mysql数据库名，用户名，密码
const sequelize = new Sequelize('test', 'root', '12345678', {
  host: 'localhost',
  dialect: 'mysql',
});

// 定义 User 模型
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
});

module.exports = {
  sequelize,
  User,
};
