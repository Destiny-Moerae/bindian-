const mysql = require('mysql2/promise'); // 使用 Promise 版本的 mysql2
const config = require('../config/config').db;

let connection;

// 连接数据库
const connectDB = async () => {
    if (!connection) {
        connection = await mysql.createConnection(config);
        console.log('MySQL connected');
    }
    return connection;
};

const findArticleByTitle = async (title) => {
    const query = 'SELECT * FROM article WHERE title = ?';
    const values = [title];
    const conn = await connectDB();
    try {
        const [results] = await conn.execute(query, values);
        return results[0];
    } catch (err) {
        throw new Error(`Failed to find article by title: ${err.message}`);
    }
};

// 向 article_text 表中插入数据
const insertArticleText = async (content,articleId,text_flag) => {
    const query = 'INSERT INTO article_text (content, article_id,text_flag) VALUES (CONVERT(? USING utf8mb4), ?,?)';;
    const values = [content,articleId,text_flag];
    const conn = await connectDB();
    // await conn.execute(query, values);
    try {
        const [results] = await conn.execute(query, values);
        return results;
    } catch (err) {
        throw new Error(`Failed to insert article: ${err.message}`);
    }
};

// 向 article 表中插入数据
const insertArticle = async (title, summary, img, date, type) => {
    const query = 'INSERT INTO article (title, summary, img, date, type, is_deleted) VALUES (?, ?, ?, ?, ?, 0)';
    const values = [title, summary, img, date, type];
    const conn = await connectDB();
    try {
        const [results] = await conn.execute(query, values);
        return results;
    } catch (err) {
        throw new Error(`Failed to insert article: ${err.message}`);
    }
};

module.exports = {
    connectDB,
    insertArticleText,
    insertArticle,
    findArticleByTitle
};