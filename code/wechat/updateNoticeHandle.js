const axios = require('axios');
async function updatNotie(accessToken, articleId) {
    try {

        const articleResponse = await axios.post(`https://api.weixin.qq.com/cgi-bin/freepublish/getarticle?access_token=${accessToken}`, { article_id: firstArticleId });

        
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
            content: '更新新闻动态失败'
        };
    }
}
    module.exports = updatNotie;
