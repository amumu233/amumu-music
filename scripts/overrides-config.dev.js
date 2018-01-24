const baseConfig = require('./overrides-config.base');


module.exports = function(config){
  // 定义 根路径别名
  let alias = config.resolve.alias;
  alias['@'] = baseConfig.rootPath;

  // 添加styl文件的loader && 最后一个必须是 file-loader
  let loaderList = config.module.rules[1].oneOf;
  loaderList.splice(loaderList.length - 1, 0, {
    test: /\.styl$/,
    use: ['style-loader', 'css-loader', 'stylus-loader']
  });
  // 添加插件处理styl文件
  config.plugins.push(baseConfig.stylusLoaderOptionsPlugin);
}