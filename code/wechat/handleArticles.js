const axios = require('axios');
const { formatDate } = require('./formatDate');
const { insertArticle, insertArticleText } = require('./db');
const downloadImage = require('./downloadImage');
const path = require('path');

const processArticles = async (api, messageContent) => {
    console.log('1')
    if (messageContent == '更新中心新闻') {
        const requestData = { offset: 0, count: 10, no_content: 1 };
        const { accessToken } = await api.ensureAccessToken();

        try {
            const response = await axios.post(`https://api.weixin.qq.com/cgi-bin/freepublish/batchget?access_token=${accessToken}`, requestData);
            
            const firstArticleId = response.data.item[0].article_id;
            const articleResponse = await axios.post(`https://api.weixin.qq.com/cgi-bin/freepublish/getarticle?access_token=${accessToken}`, { article_id: firstArticleId });

            // console.log('articleResponse',articleResponse)
            const article = articleResponse.data.news_item[0];
            const date = formatDate(JSON.stringify(articleResponse.data.update_time));
            // article.digest = article.digest || article.title;
            if(!article.digest){
                article.digest =article.title;
            }

            const imageUrl = article.thumb_url;
            const savePath = path.resolve('/Users/lisiqi/Desktop/image', 'saved_image.jpg');

            await downloadImage(imageUrl, savePath);

            
            const articleResult = await insertArticle(article.title, article.digest, savePath, date, '中心新闻');
            // console.log('firstArticleId',article.title, article.digest, savePath, date,article.url, articleResult.insertId)
            await insertArticleText(article.url, articleResult.insertId, 1);

            return {
                type: 'text',
                content: '中心新闻更新成功'
            };
        } catch (error) {
            console.error('Error processing articles:', error);
            return {
                type: 'text',
                content: '更新中心新闻失败'
            };
        }

    }
    if (messageContent == '1') {
        return {
            type: 'text',
            content: '好的'
        };
    }
};

module.exports = processArticles;