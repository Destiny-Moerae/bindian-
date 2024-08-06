const axios = require('axios');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const downloadImage = require('./downloadImage');
const { insertArticle, insertArticleText, findArticleByTitle } = require('./db');
const { formatDate } = require('./formatDate');

/**
 * 更新新闻动态
 * @param {string} accessToken - 微信 API 访问令牌
 * @param {object} news - 新闻对象数组
    const news = response.data.item.slice(0, 5).map((item, index) => ({
        index: index + 1,// 添加序号
        article_id: item.article_id,
        title: item.content.news_item[0].title, // 假设news_item数组中有一个元素
        summary:item.content.news_item[0].digest,
        imgUrl:item.content.news_item[0].thumb_url,
    }));
 * @returns {Promise<object>} 返回更新结果
 */
async function updateNews(accessToken, news, newsIndex) {
    try {
        // const articleId = news[newsIndex].article_id;
        const articleResponse = await axios.post(`https://api.weixin.qq.com/cgi-bin/freepublish/getarticle?access_token=${accessToken}`, { article_id: news[newsIndex].article_id });

        const article = articleResponse.data.news_item[0];
        const date = formatDate(JSON.stringify(articleResponse.data.update_time));

        // 调用 findArticleByTitle 方法检查是否已存在相同标题的文章
        const existingArticle = await findArticleByTitle(article.title);

        if (existingArticle) {
            return {
                type: 'text',
                content: '文章已存在，如要更新往期文章请输入‘查询往期文章'
            };
        }

        if (!article.digest) {
            article.digest = article.title;
        }

        const imageUrl = article.thumb_url;
        const uniqueFilename = `/${uuidv4()}.jpg`; // 生成唯一文件名
        const savePath = path.resolve('/Users/lisiqi/Documents/workPlace/demo/E/image/', uniqueFilename.substring(1));

        await downloadImage(imageUrl, savePath);

        const articleResult = await insertArticle(article.title, article.digest, uniqueFilename, date, '中心新闻');
        await insertArticleText(article.url, articleResult.insertId, 1);

        return {
            type: 'text',
            content: '新闻动态更新成功'
        };
    } catch (error) {
        console.error('Error processing articles:', error);
        return {
            type: 'text',
            content: '更新新闻动态失败'
        };
    }
}

module.exports = updateNews;
