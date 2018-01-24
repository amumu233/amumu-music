const
  paths = require('react-scripts/config/paths'),
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  baseConfig = require('./overrides-config.base');

const publicPath = paths.servedPath;

const shouldUseRelativeAssetPaths = publicPath === './';
const cssFilename = 'static/css/[name].[contenthash:8].css';
const extractTextPluginOptions = shouldUseRelativeAssetPaths ? { publicPath: Array(cssFilename.split('/').join('../'))} : {};


module.exports = function(config){
  let alias = config.resolve.alias;
  alias['@'] = baseConfig.rootPath;

  let loaderList = config.module.rules[1].oneOf;
  loaderList.splice(loaderList.length - 1, 0, {
    test: /\.styl$/,
    loader: ExtractTextPlugin.extract(
      Object.assign(
        {
          fallback: {
            loader: require.resolve('style-loader'),
            options: {
              hmr: false
            }
          },
          use: [
            {
              loader: require.resolve('css-loader'),
              options: {
                importLoaders: 1,
                minimize: true,
                sourceMap: true
              }
            },
            {
              loader: require.resolve('stylus-loader')
            }
          ]
        }
      ), extractTextPluginOptions
    )
  });

  config.plugins.push(baseConfig.stylusLoaderOptionsPlugin);
}