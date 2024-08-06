const axios = require('axios');

// 发送消息到用户
async function sendMessageToUser(openId, content, accessToken) {
    try {
        const response = await axios.post(`https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=${accessToken}`, {
            touser: openId,
            msgtype: 'text',
            text: {
                content: content
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error sending message:', error);
        throw new Error('消息发送失败');
    }
}

module.exports = sendMessageToUser;
