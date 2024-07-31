const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // 假设你在 db.js 中初始化了 Sequelize

const Article = sequelize.define('Article', {
    date: {
        type: DataTypes.STRING,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    digest: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'article'
});

module.exports = Article;