/*网页爬取，分为抓取数据、保存数据和读取数据，所要抓取的数据是位于一个div中的ul的每个li*/
var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');

http.get("http://www.ss.pku.endu.cn/index.php/newscenter/news",function(req,res){//抓取数据
var html = '';
var news = [];
res.setEncoding('utf-8');

res.on('data',function(chunk){
html+=chunk;
});

res.on('end',function(){//获取数据
//console.log(html);
$('#info-list-ul li').each(function(index,item){//id选择器选择相应ul中的所有li，循环遍历符合条件的item
	var news_item = {
		title:$('.info-title',this).text(),//新闻标题
		time:$('.time',this).text(),//时间
		link:'http://www.ss.pku.edu.cn'+$('a',this).attr('href'),//链接
	};
	news.push(news_item);//存入解析的数据数组
});
console.log(news);
saveData('data/data.json',news);//保存数据
});
}).on('error',function(err){
console.log(err);
});

function saveData(path,news){
	
fs.writeFile(path,JSON.stringify(news,nul,4),function(err){//将解析的数据转换为字符串，写入path
	if(err)
	{return console.log(err);}
	console.log('Data saved');
});
}
