var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');

http.get("http://www.chinadaily.com.cn",function(res){
var html='';
var news=[];
res.setEncoding('utf-8');

res.on('data',function(chunk){
html+=chunk;
});

res.on('end',function(){
//console.log(html);
var $ = cheerio.load(html);
$('.dropdown li').each(function(index,item){
var news_item = {
link:'http://www.chinadaily.com.cn'+$('a',this).attr('href')};

news.push(news_item);
});
console.log(news);
});

}).on('error',function(err){
console.log(err);
});
