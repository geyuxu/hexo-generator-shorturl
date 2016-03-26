var merge = require('utils-merge');

var config = hexo.config.sitemap = merge({
  path: 'shorturl.js'
}, hexo.config.shorturl);

hexo.extend.generator.register('shorturl', require('./lib/generator'));
