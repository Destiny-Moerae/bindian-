const axios = require('axios');
const downloadImage = require('./downloadImage');
const updateNewsHandler = require('./updateNewsHandler')
const updatNotieHandler = require('./updateNoticeHandle')
const sendMessageToUser = require('./sendHandle')

const processArticles = async (api, messageContent) => {
    const requestData = { offset: 0, count: 5, no_content: 1 };
    //验证token是否过期
    const { accessToken } = await api.ensureAccessToken();
    //获取公众号最新的文章
    const response = await axios.post(`https://api.weixin.qq.com/cgi-bin/freepublish/batchget?access_token=${accessToken}`, requestData);
    console.log('response', response.data.item[0].content.news_item[0])
    //获取公众号前五章文章的article_id、title
    const news = response.data.item.slice(0, 5).map((item, index) => ({
        index: index + 1,// 添加序号
        article_id: item.article_id,//文章id
        title: item.content.news_item[0].title, // 文章标题
        // summary:item.content.news_item[0].digest,
        // imgUrl:item.content.news_item[0].thumb_url,
    }));
    console.log('news', news);


    if (messageContent == '更新最新新闻动态') {
        try {
            //获取最新的文章article_id
            const firstArticleId = news[0].article_id;
            //更新到数据库中
            const result = await updateNewsHandler(accessToken, news, 0);
            console.log('Update result:', result);
            return {
                type: 'text',
                content: result.content
            };
        } catch (error) {
            console.error('Error calling updateNewsHandler:', error);
            return {
                type: 'text',
                content: '最新新闻动态更新失败'
            };
        }
    } else if (messageContent == '更新最新通知公告') {
        console.log('2')
        try {
            const result = await updatNotieHandler(accessToken, news, 0);
            return {
                type: 'text',
                content: result.content
            };
        } catch (error) {
            console.error('Error calling updatNotieHandler:', error);
            return {
                type: 'text',
                content: '最新通知公告更新失败'
            };
        }
    }

    if (messageContent == '查询往期文章') {
        const formattedArticles = news.map(article => `${article.index}. 标题: ${JSON.stringify(article.title)}`).join('\n');
        return {
            type: 'text',
            content: `最新的五篇文章:\n${formattedArticles}\n如需更新请回复'文章标题_更新位置(新闻动态/通知公告)'`
        };
    }

    if (messageContent === `${news[0].title}_新闻动态`) {
        try {
            const articleId = news[0].article_id;
            const result = await updateNewsHandler(accessToken, news, 0);
            console.log('Update result:', result);
            return {
                type: 'text',
                content: result.content
            };
        } catch (error) {
            console.error('Error calling updateNewsHandler:', error);
            return {
                type: 'text',
                content: '新闻动态更新失败'
            };
        }
    }
    if (messageContent === `${news[1].title}_新闻动态`) {
        try {
            const articleId = news[1].article_id;
            const result = await updateNewsHandler(accessToken, news, 1);
            console.log('Update result:', result);
            return {
                type: 'text',
                content: result.content
            };
        } catch (error) {
            console.error('Error calling updateNewsHandler:', error);
            return {
                type: 'text',
                content: '新闻动态更新失败'
            };
        }
    }
    if (messageContent === `${news[2].title}_新闻动态`) {
        try {
            const articleId = news[2].article_id;
            const result = await updateNewsHandler(accessToken, news, 2);
            console.log('Update result:', result);
            return {
                type: 'text',
                content: result.content
            };
        } catch (error) {
            console.error('Error calling updateNewsHandler:', error);
            return {
                type: 'text',
                content: '新闻动态更新失败'
            };
        }
    }
    if (messageContent === `${news[3].title}_新闻动态`) {
        try {
            const articleId = news[3].article_id;
            const result = await updateNewsHandler(accessToken, news, 3);
            console.log('Update result:', result);
            return {
                type: 'text',
                content: result.content
            };
        } catch (error) {
            console.error('Error calling updateNewsHandler:', error);
            return {
                type: 'text',
                content: '新闻动态更新失败'
            };
        }
    }
    if (messageContent === `${news[4].title}_新闻动态`) {
        try {
            const articleId = news[4].article_id;
            const result = await updateNewsHandler(accessToken, news, 4);
            console.log('Update result:', result);
            return {
                type: 'text',
                content: result.content
            };
        } catch (error) {
            console.error('Error calling updateNewsHandler:', error);
            return {
                type: 'text',
                content: '新闻动态更新失败'
            };
        }
    }
    if (messageContent === `${news[0].title}_通知公告`) {
        try {
            const result = await updatNotieHandler(accessToken, news, 0);
            console.log('Update result:', result);
            return {
                type: 'text',
                content: result.content
            };
        } catch (error) {
            console.error('Error calling updateNewsHandler:', error);
            return {
                type: 'text',
                content: '通知公告更新失败'
            };
        }
    }
    if (messageContent === `${news[4].title}_通知公告`) {
        try {
            const result = await updatNotieHandler(accessToken, news, 4);
            console.log('Update result:', result);
            return {
                type: 'text',
                content: result.content
            };
        } catch (error) {
            console.error('Error calling updateNewsHandler:', error);
            return {
                type: 'text',
                content: '通知公告更新失败'
            };
        }
    }
    if (messageContent === `${news[3].title}_通知公告`) {
        try {
            const result = await updatNotieHandler(accessToken, news, 3);
            console.log('Update result:', result);
            return {
                type: 'text',
                content: result.content
            };
        } catch (error) {
            console.error('Error calling updateNewsHandler:', error);
            return {
                type: 'text',
                content: '通知公告更新失败'
            };
        }
    }
    if (messageContent === `${news[2].title}_通知公告`) {
        try {
            const result = await updatNotieHandler(accessToken, news, 2);
            console.log('Update result:', result);
            return {
                type: 'text',
                content: result.content
            };
        } catch (error) {
            console.error('Error calling updateNewsHandler:', error);
            return {
                type: 'text',
                content: '通知公告更新失败'
            };
        }
    }
    if (messageContent === `${news[1].title}_通知公告`) {
        try {
            const result = await updatNotieHandler(accessToken, news, 1);
            console.log('Update result:', result);
            return {
                type: 'text',
                content: result.content
            };
        } catch (error) {
            console.error('Error calling updateNewsHandler:', error);
            return {
                type: 'text',
                content: '通知公告更新失败'
            };
        }
    }
    if (messageContent === `${news[0].title}_通知公告`) {
        try {
            const result = await updatNotieHandler(accessToken, news, 0);
            console.log('Update result:', result);
            return {
                type: 'text',
                content: result.content
            };
        } catch (error) {
            console.error('Error calling updateNewsHandler:', error);
            return {
                type: 'text',
                content: '通知公告更新失败'
            };
        }
    }
};

module.exports = processArticles;