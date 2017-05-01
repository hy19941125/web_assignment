var https = require('https');
var access_token = 'ARCM-XCWxcsgvHPQt5';//通过access_token.js文件获取的access_token
var menu = {//设置菜单选项
"button":[
{
	"name":"社会招聘",
	"sub_button":[
	{
		"type":"click",
		"name":"招聘岗位",
		"key":"V1001_SOCIAL_POS"//键值
	},
	{
		"type":"click",
		"name":"招聘流程",
		"key":"V1002_PROCEDURE"
	}
	]
}
{
	"name":"校园招聘",
	"sub_button":[
	{
		"type":"click",
		"name":"招聘岗位",
		"key":"V1001_CAMPUS_POS"
	},
	{
		"type":"click",
		"name":"面试机经",
		"key":"V1002_TIPS"
		”url":https://www.baidu.com
	},
	]
}
]
};

var post_str = new Buffer(JSON.stringify(menu);//将创建的菜单转换成字符串
console.log(post_str.toString());
console.log(post_str.length);

var post_options={//设置Post请求信息
	host:'api.weixin.qq.com',
	port:'443',
	path:'/cgi-bin/menu/create?access_token',
	method:'POST',
	headers:{
	'Content-Type':'application/x-www-form',
	'Content-Length':post_str.length
	}
};
var post_req=https.require(post_options,function(req,res){
var responseText=[];
var size=0;
res.setEncoding('utf8');//设置响应字符编码格式为utf-8
res.on('data',function(data){
responseText.push(data);
size+=data.length;
});
res.on('end',function(){
console.log(responseText);//响应事件，返回响应消息
});
});
post_req.write(post_str);
post_req.end();