const axios = require('axios');
const { formatDate } = require('./formatDate');
const { insertArticle, insertArticleText, findArticleByTitle } = require('./db');
const downloadImage = require('./downloadImage');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const processArticles = async (api, messageContent) => {
    console.log('1')
    if (messageContent == '更新中心新闻') {
        const requestData = { offset: 0, count: 5, no_content: 1 };
        const { accessToken } = await api.ensureAccessToken();

        try {
            const response = await axios.post(`https://api.weixin.qq.com/cgi-bin/freepublish/batchget?access_token=${accessToken}`, requestData);
            console.log('response', response)
            const firstArticleId = response.data.item[0].article_id;
            const articleResponse = await axios.post(`https://api.weixin.qq.com/cgi-bin/freepublish/getarticle?access_token=${accessToken}`, { article_id: firstArticleId });

            // console.log('articleResponse',articleResponse)
            const article = articleResponse.data.news_item[0];
            const date = formatDate(JSON.stringify(articleResponse.data.update_time));
            // article.digest = article.digest || article.title;

            // 调用 findArticleByTitle 方法检查是否已存在相同标题的文章
            const existingArticle = await findArticleByTitle(article.title);

            if (existingArticle) {
                return {
                    type: 'text',
                    content: '文章已存在，无需更新'
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

    } else if (messageContent == '更新通知公告') {
        console.log('2')
        const requestData = { offset: 0, count: 5, no_content: 1 };
        const { accessToken } = await api.ensureAccessToken();

        try {
            const response = await axios.post(`https://api.weixin.qq.com/cgi-bin/freepublish/batchget?access_token=${accessToken}`, requestData);
            console.log('response', JSON.stringify(response.data.item[1]))
            const firstArticleId = response.data.item[0].article_id;
            const articleResponse = await axios.post(`https://api.weixin.qq.com/cgi-bin/freepublish/getarticle?access_token=${accessToken}`, { article_id: firstArticleId });

            // console.log('articleResponse',articleResponse.data.news_item[0])
            const article = articleResponse.data.news_item[0];
            const date = formatDate(JSON.stringify(articleResponse.data.update_time));
            // article.digest = article.digest || article.title;

            // 调用 findArticleByTitle 方法检查是否已存在相同标题的文章
            const existingArticle = await findArticleByTitle(article.title);

            if (existingArticle) {
                return {
                    type: 'text',
                    content: '文章已存在，无需更新'
                };
            }

            if (!article.digest) {
                article.digest = article.title;
            }

            const imageUrl = article.thumb_url;
            const uniqueFilename = `/${uuidv4()}.jpg`; // 生成唯一文件名
            const savePath = path.resolve('/Users/lisiqi/Documents/workPlace/demo/E/image/', uniqueFilename.substring(1));

            await downloadImage(imageUrl, savePath);


            const articleResult = await insertArticle(article.title, article.digest, uniqueFilename, date, '通知公告');
            await insertArticleText(article.url, articleResult.insertId, 1);

            return {
                type: 'text',
                content: '中心通知公告成功'
            };
        } catch (error) {
            console.error('Error processing articles:', error);
            return {
                type: 'text',
                content: '更新通知公告失败'
            };

        }
    }
    // if (messageContent == '1') {
    //     return {
    //         type: 'text',
    //         content: '好的'
    //     };
    // }
};

module.exports = processArticles;