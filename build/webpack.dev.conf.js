var webpack = require('webpack')
var merge = require('webpack-merge')
var webpackBaseConfig = require('./webpack.base.conf.js')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

var webpackConfig = merge(webpackBaseConfig, {
  mode: 'development',
  entry: {
    vendor: './examples/index.js'
  },
  devtool: 'source-map',
  output: {
    filename: '[name].js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './examples/index.html',
      inject: true
    }),
    new ExtractTextPlugin({
      filename: '[name].css'
    }),
  ]
})

module.exports = webpackConfig
