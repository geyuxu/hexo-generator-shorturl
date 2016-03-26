var ejs = require('ejs');
var pathFn = require('path');
var fs = require('fs');
var crypto = require('crypto');

var sitemapSrc = pathFn.join(__dirname, '../shorturl.ejs');
var sitemapTmpl = ejs.compile(fs.readFileSync(sitemapSrc, 'utf8'));


module.exports = function(locals){
  var config = this.config;

  var posts = [].concat(locals.posts.toArray(), locals.pages.toArray())
    .filter(function(post){
      return post.sitemap !== false;
    })
    .sort(function(a, b){
      return b.updated - a.updated;
    });

	var data = {};
	posts.forEach(function(post){
		var link = post.permalink;
		var date = post.updated.toISOString() || post.date.toISOString();
		var md5 = crypto.createHash('md5');
		var password = md5.update(link+date).digest('base64');
		password = password.replace(/[^0-9a-zA-Z_\-]/g,'');
		//password 取前3位
		var shorturl = password.substring(0,3);
		//data[shorturl]如果不为 null password 再多取一位，直到取完
		for(var i = 4;data[shorturl] !== undefined;i++){
			shorturl = password.substring(0,i);
		}
		data[shorturl]=link;
	});

	var jsString = sitemapTmpl({
		config: config,
		data:JSON.stringify(data) 
	});
  return {
	path: "shorturl.js",
    data: jsString
  };
};
