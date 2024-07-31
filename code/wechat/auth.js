/*
  signature: 'd26bf2a854c978546841b116532819346bd2abf7',
  echostr: '4406693999997216765',
  timestamp: '1721885237',
  nonce: '1783440227'
  计算服务器signature微信加密签名和微信传递的signature进行对比
  如何计算？
  1.微信签名的三个参数（timestamp，nonce，token）按照字典排列并组合成一个数组
  2.将数组里的属性拼接成一个数组，进行sha1加密
*/

const sha1 = require('sha1')
const config = require('../config')
module.exports = () => {
    return async ctx=>{
        // console.log(ctx.query)
        if(ctx.method === 'GET'){
            const {signature,echostr,timestamp,nonce} = ctx.query;
            const {token} = config;
            const arr =[timestamp,nonce,token];
            console.log('arr',arr)
            const str = arr.join('')
            const sha1Str = sha1(str);
            console.log(sha1Str)
            if(sha1Str === signature){
                //证明是来自微信服务器
                return ctx.body = echostr;
            }else if(ctx.method === 'POST'){
    
            }
        }
        ctx.body = 'hello'
    }
}