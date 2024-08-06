const axios = require('axios');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const downloadImage = require('./downloadImage');
const { insertArticle, insertArticleText, findArticleByTitle } = require('./db');
const { formatDate } = require('./formatDate');

async function updatNotie(accessToken, news, newsIndex) {
    try {
        //通过article_id拿到文章的title、summary、文章url和发表时间
        const articleResponse = await axios.post(`https://api.weixin.qq.com/cgi-bin/freepublish/getarticle?access_token=${accessToken}`, { article_id: news[newsIndex].article_id });
        const article = articleResponse.data.news_item[0];
        //时间戳格式调整
        const date = formatDate(JSON.stringify(articleResponse.data.update_time));
        // 调用 findArticleByTitle 方法检查是否已存在相同标题的文章
        const existingArticle = await findArticleByTitle(article.title);

        if (existingArticle) {
            return {
                type: 'text',
                content: '文章已存在，如要更新往期文章请输入‘查询往期文章‘'
            };
        }
        //有些文章在建立的时候并没有编辑摘要，当摘要内容为空时，将标题内容填入摘要中
        if (!article.digest) {
            article.digest = article.title;
        }

        const imageUrl = article.thumb_url;
        const uniqueFilename = `/${uuidv4()}.jpg`; // 生成唯一文件名
        //需改为自己本地路径xxx/xxx/demo/E/image/
        const savePath = path.resolve('/Users/lisiqi/Documents/workPlace/demo/E/image/', uniqueFilename.substring(1));

        await downloadImage(imageUrl, savePath);
        //存入数据库中
        const articleResult = await insertArticle(article.title, article.digest, uniqueFilename, date, '通知公告');
        await insertArticleText(article.url, articleResult.insertId, 1);

        return {
            type: 'text',
            content: '更新通知公告成功'
        };
    } catch (error) {
        console.error('Error processing articles:', error);
        return {
            type: 'text',
            content: '更新通知公告失败'
        };
    }
}
    module.exports = updatNotie;
