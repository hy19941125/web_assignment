var PORT = 9530;//监听端口号为9530，在微信开发者平台中设置的端口号
var http = require('http');//加载http模块
var qs = require('qs');//加载qs模块，用于字符串解析和转换

var TOKEN = 'sspku';//与微信开发者平台中设置的TOKEN保持一致

//token验证
function checkSignature(params,token){

var key = [token,params.timestamp,params.nonce].sort().join('');//将token,params的时间戳,params的随机数用字典序排序，并连接成字符串
var sha1 = require('crypto').createHash('sha1');//加密
sha1.update(key);

return sha1.digest('hex') == params.signature;//进行匹配验证
}
//回复消息
function replyText(msg, replyText) {
    switch(msg.xml.MsgType[0]){//判别msg的类型，并回复相应的类型反馈信息
	case 'text':
	feedback = '文本消息';
	break;
	case 'image':
	feedback = '图片消息';
	break;
	case 'shortvideo':
	feedback = '小视频';
	break;
	case 'voice':
	feedback = '语音消息';
	case 'location':
	feedback = '位置消息';
	case 'link':
	feedback = '链接消息';
	break;
	default:
	feedback = '未知类型消息'
	}
	var tmpl = require('tmpl');//tmpl信息回复模板
	var replyTmpl = '<xml>'+
	'<ToUserName><![CDATA[{toUser}]]></ToUserName>' +
    '<FromUserName><![CDATA[{fromUser}]]></FromUserName>' +
    '<CreateTime><![CDATA[{time}]]></CreateTime>' +
    '<MsgType><![CDATA[{type}]]></MsgType>' +
    '<Content><![CDATA[{content}]]></Content>' +
    '</xml>';

  return tmpl(replyTmpl, {//设置回复信息
    toUser: msg.xml.FromUserName[0],
    fromUser: msg.xml.ToUserName[0],
    type: 'text',
    time: Date.now(),
    content: feedback
  });
}
	}
}
//创建web服务器
var server = http.createServer(function(req,res){
	var query = require('url').parse(req.url).query;//url是开发者用来接收微信消息和事件的接口URL
	var params = qs.parse(query);//qs将url中的query解析成json
	
	console.log(params);//输出解析结果
	console.log("token-->",TOKEN);//输出TOKEN
	
	if(！checkSignature(params,TOKEN))//验证是否是微信发来的请求
	res.end('signature fail');
	return;
}
if(req.method == "GET"){
res.end(params.echostr);
}else{//POST请求
var postdata="";
req.addListener("data",function(postchunk){//'data'事件，对数据进行解析
postdata+= postchunk;
});
req.addListener("end",function(){//请求完成后返回数据解析结果
var parseString = require('xml2js').parseString;//将xml转换成js
parseString(postdata,function(err,result){
if(!err){
var res = replyText(result,'消息推送成功！');
res.end(res);
}
}
});
}
);
server.listen(PORT);
console.log("server running at port:"+PORT+".");