const webpack = require('webpack');

module.exports = {
  entry: {
    popup: ['babel-polyfill','./src/popup.js'],
    background: ['babel-polyfill','./src/background.js'],
    contentscript: ['babel-polyfill','./src/contentscript.js'],
    options: ['babel-polyfill','./src/options.js'],
  },
  output: {
    path: __dirname + '/app/',
    filename: 'scripts/[name].js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015-loose'],
          cacheDirectory: true,
        },
      }, 
      /* TODO set up LESS/SASS
      {
        test: /\.less$/,
        exclude: /node_modules/,
        loader: 'style!css!less',
      } */
    ],
  },
  resolve: {
    extensions: ['', '.js'],
  },
};
