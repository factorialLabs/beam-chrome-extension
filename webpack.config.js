const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: {
    popup: ['babel-polyfill','./src/popup/entry.js'],
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
        test: [/\.js$/,/\.jsx$/],
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react'],
          cacheDirectory: true,
        },
      }, 
      {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract("style-loader", "css-loader")
      },
      {
          test: /\.scss/,
          loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader")
      },
    ],
  },
  resolve: {
    extensions: ['', '.js'],
  },
  plugins: [
      new ExtractTextPlugin('styles/[name].css')
  ]
};
