var later=require('later');
var https=require('https');

var appid="wx3a031b1563370371";
var appsecret="d4624c36b6795d1d99dcf05";
var access_token;

later.date.localTime();
console.log("Now"+new Date());

var sched = later.parse.recur.every(1).hour();//设置事件触发的间隔，每一个小时触发一次
next = later.schedule(sched).next(10);//从当前时间开始循环10次
console.log(next);

var timer=later.setInterval(test,sched);
setTimeout(test,2000);//第一次事件有载入队列，但没被调用，这里用setTimeout让第一次事件被调用

function test(){
	console.log(new Date());
	var options={//设置请求主机、路径
		hostname:'api.weixin.qq.com',
		path:'/cgi-bin/token?grant_type=client_
	};
	var req=https.get(options,function(res){
		var bodyChunks="";
		res.on('data',function(chunk){
			bodyChunks+=chunk;
		});
		res.on('end',function(){
			var body = JSON.parse(bodyChunks);//将请求体转换为JSON格式
			if(body.access_token){//获取对象中的access_token属性值
				access_token=body.access_token;
				console.log(access_token);
			}else{//如果该对象中没有access_token，就显示body的具体内容
				console.dir(body);
			}
		});
	});
	req.on('error',function(e){//请求有误，提示错误消息
		console.log('ERROR:'+e.message);
	});
}