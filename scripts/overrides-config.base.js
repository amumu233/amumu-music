const
  path = require('path'),
  webpack = require('webpack'),
  poststylus = require('poststylus'),
  autoprefixer = require('autoprefixer');

function resolve(dir){
  return path.join(__dirname, '..', dir);
}

module.exports.rootPath = resolve('src');

module.exports.stylusLoaderOptionsPlugin = new webpack.LoaderOptionsPlugin({
  options: {
    stylus: {
      use: [
        poststylus([
          require('postcss-flexbugs-fixes'),
          autoprefixer({
            browsers: [
              '>1%',
              'last 4 versions',
              'Firefox ESR',
              'not ie < 9',
            ],
            flexbox: 'no-2009'
          })
        ])
      ]
    }
  }
})