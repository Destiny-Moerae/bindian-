//微信图片有限制，需要先将微信图片保存到本地
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const downloadImage = async (imageUrl, savePath) => {
    try {
        const response = await axios.get(imageUrl, {
            responseType: 'stream',
            headers: {
                'Referer': '' // 移除或设置特定的 Referer 头信息
            }
        });

        const writer = fs.createWriteStream(savePath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        throw new Error(`Failed to download image: ${error.message}`);
    }
};

module.exports = downloadImage;