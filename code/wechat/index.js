
const sha1 = require('sha1')
// const config = require('../config')
const getRowBody = require('raw-body')
// const parseString = require('xml2js').parseString
const xml2js = require('xml2js');
const parser = new xml2js.Parser({
    trim: true,
    explicitArray: false,
    ignoreAttrs: true
})

const ejs = require('ejs')
const tpl = `
<xml>
  <ToUserName><![CDATA[<%- toUsername %>]]></ToUserName>
  <FromUserName><![CDATA[<%- fromUsername %>]]></FromUserName>
  <CreateTime><%= createTime %></CreateTime>
  <MsgType><![CDATA[<%-msgType %>]]></MsgType>
  <Content><![CDATA[<%-content %>]]></Content>
</xml>
`;
const compiled = ejs.compile(tpl);

function reply(content,fromUsername,toUsername){
    let info = {};
    info.toUsername = toUsername;
    info.fromUsername = fromUsername;
    info.createTime = new Date().getTime();
    info.content = content || '';
    info.msgType = 'text';
    return compiled(info)
}
// const replyXML = reply('你好','开发者账号','接收方账号')
// console.log(replyXML)

//解析xml的数据为js对象方法
function parseXML(xml) {
    return new Promise((resolve, reject) => {
        parseString(xml, {
            trim: true,
            explicitArray: false,
            ignoreAttrs: true
        }, (err, result) => {
            if (err) {
                return reject(err)
            }
            resolve(result.xml)
        })
    })

}
module.exports = (config,handle) => {
    return async ctx => {
        const { signature, echostr, timestamp, nonce } = ctx.query;
        const { token } = config;
        const arr = [timestamp, nonce, token];
        // console.log('arr',arr)
        const str = arr.join('')
        const sha1Str = sha1(str);
        console.log(ctx.method)
        if (ctx.method === 'GET') {
            // console.log(sha1Str)
            if (sha1Str === signature) {
                //证明是来自微信服务器
                return ctx.body = echostr;
            }
        } else if (ctx.method == 'POST') {
            if (sha1Str === signature) {
                //解析xml数据
                const xml = await getRowBody(ctx.req, {
                    length: ctx.request.length,
                    limit: "1mb",
                    encoding: ctx.request.charset || 'utf-8'
                })
                // console.log(xml)
                //将xml转换成js对象
                // const formatResult = await parseXML(xml);
                const formatResult = await parser.parseStringPromise(xml)
                console.log(formatResult.xml)
                const formatted = formatResult.xml;
                const content = await handle(formatted,ctx)
                console.log("content",content)
                // let content = ''
                // if (formatted.MsgType === 'text') {
                //     if(formatted.Content == '更新'){

                //     }
                //    content = formatted.Content
                  
                // }
                const replyXML = reply(content,formatted.ToUserName,formatted.FromUserName)
                console.log('replyXML',replyXML)
                return ctx.body = replyXML

            }

        }

    }
}